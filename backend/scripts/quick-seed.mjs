import { PrismaClient, Role, Status } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding…');

  // 1) Departmanlar (idempotent)
  const fd = await prisma.department.upsert({
    where: { name: 'Front Desk' },
    update: {},
    create: { name: 'Front Desk' },
  });
  const hk = await prisma.department.upsert({
    where: { name: 'Housekeeping' },
    update: {},
    create: { name: 'Housekeeping' },
  });

  // 2) Admin kullanıcı (idempotent)
  const adminEmail = 'admin@example.com';
  const adminPassHash =
    '$2b$10$4gG5uP5fYfN0zv8vTg2rQuapcJ0m8FbLQxBzH3c/1fS0qv3n3o2CS'; // "secret12"
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: adminPassHash, role: Role.ADMIN },
    select: { id: true, email: true, role: true },
  });

  // 3) Örnek şikayet (idempotent)
  const title = 'Örnek: Klima çalışmıyor';
  const exists = await prisma.complaint.findFirst({ where: { title } });
  if (!exists) {
    await prisma.complaint.create({
      data: {
        title,
        description: 'Oda sıcak, klima yanıt vermiyor.',
        status: Status.OPEN,
        departmentId: hk.id,
        createdById: admin.id,
      },
    });
  }

  console.log('Seed tamam ✅');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
