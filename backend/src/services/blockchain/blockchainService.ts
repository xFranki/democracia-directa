import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BlockData {
  type: 'PROPOSAL' | 'VOTE';
  payload: Record<string, unknown>;
  timestamp: string;
}

export class BlockchainService {
  // Serialización JSON con claves ordenadas — garantiza determinismo independientemente del orden de inserción o de cómo PostgreSQL jsonb almacena los objetos
  static stableStringify(obj: unknown): string {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      return JSON.stringify(obj);
    }
    const record = obj as Record<string, unknown>;
    const sorted = Object.keys(record).sort().map(k => `${JSON.stringify(k)}:${this.stableStringify(record[k])}`);
    return `{${sorted.join(',')}}`;
  }

  // Genera el hash SHA-256 de un bloque
  static computeHash(index: number, previousHash: string, timestamp: string, data: unknown, nonce: number): string {
    const content = `${index}${previousHash}${timestamp}${this.stableStringify(data)}${nonce}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  // Proof of Work simplificado (dificultad baja — es simulación)
  static mineBlock(index: number, previousHash: string, data: BlockData): { hash: string; nonce: number; timestamp: string } {
    const difficulty = 3; // 3 ceros al inicio — rápido pero visualmente real
    const timestamp = new Date().toISOString();
    let nonce = 0;
    let hash = '';

    do {
      nonce++;
      hash = this.computeHash(index, previousHash, timestamp, data, nonce);
    } while (!hash.startsWith('0'.repeat(difficulty)));

    return { hash, nonce, timestamp };
  }

  // Calcula Merkle Root de los hashes de las transacciones
  static computeMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return crypto.createHash('sha256').update('empty').digest('hex');
    if (hashes.length === 1) return hashes[0];

    const pairs: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i];
      const right = hashes[i + 1] || hashes[i]; // Si número impar, duplica el último
      pairs.push(crypto.createHash('sha256').update(left + right).digest('hex'));
    }

    return this.computeMerkleRoot(pairs);
  }

  // Obtiene el último bloque de la cadena
  static async getLastBlock() {
    return prisma.block.findFirst({ orderBy: { index: 'desc' } });
  }

  // Crea el bloque génesis si no existe
  static async initGenesis() {
    const existing = await prisma.block.count();
    if (existing > 0) return;

    const timestamp = new Date().toISOString();
    const genesisData: BlockData = {
      type: 'PROPOSAL',
      payload: { message: 'Bloque génesis — Democracia Directa — España' },
      timestamp,
    };

    const hash = this.computeHash(0, '0'.repeat(64), timestamp, genesisData, 0);

    await prisma.block.create({
      data: {
        index: 0,
        hash,
        previousHash: '0'.repeat(64),
        merkleRoot: this.computeMerkleRoot([hash]),
        data: genesisData as object,
        nonce: 0,
        timestamp: new Date(timestamp),
      },
    });
  }

  // Añade un nuevo bloque a la cadena
  static async addBlock(data: BlockData): Promise<string> {
    const lastBlock = await this.getLastBlock();
    if (!lastBlock) throw new Error('Blockchain no inicializada');

    const newIndex = lastBlock.index + 1;
    const { hash, nonce, timestamp } = this.mineBlock(newIndex, lastBlock.hash, data);

    const block = await prisma.block.create({
      data: {
        index: newIndex,
        hash,
        previousHash: lastBlock.hash,
        merkleRoot: this.computeMerkleRoot([hash, lastBlock.hash]),
        data: data as object,
        nonce,
        timestamp: new Date(timestamp),
      },
    });

    return block.hash;
  }

  // Genera hash único para un voto (recibo verificable)
  static generateVoteHash(userId: string, proposalId: string, choice: string, timestamp: string): string {
    const content = `${userId}:${proposalId}:${choice}:${timestamp}:${crypto.randomBytes(16).toString('hex')}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  // Genera dirección tipo Web3 para un usuario
  static generateWalletAddress(userId: string, email: string): string {
    const content = `${userId}:${email}:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    return '0x' + hash.substring(0, 40);
  }

  // Verifica la integridad de toda la cadena
  static async verifyChain(): Promise<{ valid: boolean; brokenAtIndex?: number }> {
    const blocks = await prisma.block.findMany({ orderBy: { index: 'asc' } });

    for (let i = 1; i < blocks.length; i++) {
      const current = blocks[i];
      const previous = blocks[i - 1];

      if (current.previousHash !== previous.hash) {
        return { valid: false, brokenAtIndex: current.index };
      }

      const recomputedHash = this.computeHash(
        current.index,
        current.previousHash,
        current.timestamp.toISOString(),
        current.data,
        current.nonce
      );

      if (recomputedHash !== current.hash) {
        return { valid: false, brokenAtIndex: current.index };
      }
    }

    return { valid: true };
  }

  // Verifica un recibo de voto específico
  static async verifyVoteReceipt(voteHash: string): Promise<boolean> {
    const vote = await prisma.vote.findUnique({ where: { voteHash } });
    return vote !== null;
  }
}
