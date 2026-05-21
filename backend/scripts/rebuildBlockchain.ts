import { PrismaClient } from '@prisma/client';
import { BlockchainService } from '../src/services/blockchain/blockchainService';

const prisma = new PrismaClient();

async function main() {
  const proposals = await prisma.proposal.findMany({ orderBy: { createdAt: 'asc' } });
  const votes = await prisma.vote.findMany({ orderBy: { createdAt: 'asc' } });

  console.log(`Reconstruyendo blockchain: ${proposals.length} propuestas, ${votes.length} votos`);

  // Deshabilitar FK constraints para poder borrar bloques con referencias activas
  await prisma.$executeRaw`SET session_replication_role = replica`;
  await prisma.block.deleteMany();
  console.log('Bloques eliminados');

  // Recrear génesis
  await BlockchainService.initGenesis();
  console.log('Génesis creado');

  // Mezclar propuestas y votos por orden cronológico
  type Event =
    | { type: 'proposal'; id: string; title: string; authorId: string; category: string; territory: string; createdAt: Date }
    | { type: 'vote'; id: string; voteHash: string; proposalId: string; choice: string; isAnonymous: boolean; createdAt: Date };

  const events: Event[] = [
    ...proposals.map(p => ({ type: 'proposal' as const, id: p.id, title: p.title, authorId: p.authorId, category: p.category as string, territory: p.territory as string, createdAt: p.createdAt })),
    ...votes.map(v => ({ type: 'vote' as const, id: v.id, voteHash: v.voteHash, proposalId: v.proposalId, choice: v.choice as string, isAnonymous: v.isAnonymous, createdAt: v.createdAt })),
  ].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  for (const event of events) {
    if (event.type === 'proposal') {
      const blockHash = await BlockchainService.addBlock({
        type: 'PROPOSAL',
        payload: { title: event.title, authorId: event.authorId, category: event.category, territory: event.territory },
        timestamp: event.createdAt.toISOString(),
      });
      await prisma.proposal.update({ where: { id: event.id }, data: { blockHash } });
      console.log(`Propuesta "${event.title}" → bloque ${blockHash.slice(0, 12)}...`);
    } else {
      const blockHash = await BlockchainService.addBlock({
        type: 'VOTE',
        payload: { voteHash: event.voteHash, proposalId: event.proposalId, choice: event.choice, isAnonymous: event.isAnonymous, timestamp: event.createdAt.toISOString() },
        timestamp: event.createdAt.toISOString(),
      });
      await prisma.vote.update({ where: { id: event.id }, data: { blockHash } });
      console.log(`Voto ${event.choice} → bloque ${blockHash.slice(0, 12)}...`);
    }
  }

  // Reactivar FK constraints
  await prisma.$executeRaw`SET session_replication_role = DEFAULT`;

  // Verificar resultado
  const result = await BlockchainService.verifyChain();
  if (result.valid) {
    console.log('\n✅ Blockchain reconstruida y verificada correctamente');
  } else {
    console.error(`\n❌ Fallo en índice ${result.brokenAtIndex}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
