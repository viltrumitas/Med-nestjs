import { Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { seedMedicalAreas } from "./seeds/seed-medical-area";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('12345678', 10);

  await prisma.user.create({
    data: {
      matricula: 202200008,
      firstName: "Ismael",
      lastName: "Azcatl",
      password: hash,
      role: 'ADMIN', 
    },
  });

  await seedMedicalAreas(prisma);
}

main()
  .finally(() => prisma.$disconnect());