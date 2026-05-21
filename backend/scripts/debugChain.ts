import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function debug() {
  const blocks = await prisma.block.findMany({ orderBy: { index: 'asc' } });
  for (const b of blocks) {
    const tsIso = b.timestamp.toISOString();
    const dataJson = JSON.stringify(b.data);
    const content = `${b.index}${b.previousHash}${tsIso}${dataJson}${b.nonce}`;
    const recomputed = crypto.createHash('sha256').update(content).digest('hex');
    console.log(`\nBloque ${b.index}: match=${b.hash === recomputed}`);
    console.log(`  data (de DB): ${dataJson}`);
  }
  await prisma.$disconnect();
}

debug().catch(console.error);
