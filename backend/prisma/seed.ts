import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started…');

  // 1) Departmanlar (idempotent: upsert)
  const departments = ['Front Desk', 'Housekeeping'];
  for (const name of departments) {
    await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Departments OK');

  // 2) Admin kullanıcı (email unique)
  const adminEmail = 'admin@example.com';
  const adminPass = 'secret12'; // dev ortamı
  const passwordHash = await bcrypt.hash(adminPass, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // varsa dokunma
    create: { email: adminEmail, passwordHash, role: Role.ADMIN },
  });
  console.log('Admin user OK →', admin.email);

  // 3) Örnek şikayet (yoksa oluştur)
  const hk = await prisma.department.findUnique({ where: { name: 'Housekeeping' } });
  if (hk) {
    const existing = await prisma.complaint.findFirst({
      where: { title: 'Örnek: Klima çalışmıyor' },
    });
    if (!existing) {
      await prisma.complaint.create({
        data: {
          title: 'Örnek: Klima çalışmıyor',
          description: 'Oda sıcak, klima yanıt vermiyor.',
          status: 'OPEN',
          departmentId: hk.id,
          createdById: admin.id,
        },
      });
      console.log('Sample complaint created');
    } else {
      console.log('Sample complaint already exists');
    }
  }

  console.log('Seeding completed ✅');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
