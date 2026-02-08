import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. スタッフ作成
  // ※ hourlyWage は削除しました（AssignmentのcostRateで管理するため）
  const staff1 = await prisma.staff.create({
    data: {
      name: '山田 太郎',
      email: 'yamada@example.com',
      phone: '090-1111-2222',
      status: 'active',
    },
  });

  const staff2 = await prisma.staff.create({
    data: {
      name: '佐藤 花子',
      email: 'sato@example.com',
      phone: '080-3333-4444',
      status: 'active',
    },
  });

  // 2. クライアント作成
  const client1 = await prisma.client.create({
    data: {
      companyName: '株式会社テックイノベーション',
      contactPerson: '鈴木 一郎',
      email: 'suzuki@tech.co.jp',
      phone: '03-1234-5678',
    },
  });

  // 3. プロジェクト作成 (完了案件含む)
  const project1 = await prisma.project.create({
    data: {
      name: '次世代AI開発プロジェクト',
      clientId: client1.id,
      budget: 500000,
      status: 'active', // 稼働中
      startDate: new Date('2024-01-01'),
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: '社内システム改修',
      clientId: client1.id,
      budget: 300000,
      status: 'completed', // ★完了 (請求対象)
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-01-31'),
    },
  });

  // 4. アサイン作成
  await prisma.assignment.create({
    data: {
      staffId: staff1.id,
      projectId: project1.id,
      role: 'リードエンジニア',
      chargeRate: 5000, // 請求単価
      costRate: 2500,   // 原価(給与)
      startDate: new Date('2024-01-01'),
    },
  });
  
  // project2へのアサインも追加（請求書作成テスト用）
  await prisma.assignment.create({
    data: {
      staffId: staff2.id,
      projectId: project2.id,
      role: 'プログラマー',
      chargeRate: 3000,
      costRate: 1500,
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-01-31'),
    },
  });

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });