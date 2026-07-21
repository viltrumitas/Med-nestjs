import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.review.deleteMany(),
    prisma.submission.deleteMany(),
    prisma.assignedCase.deleteMany(),
    prisma.assignment.deleteMany(),
    prisma.case.deleteMany(),
    prisma.enrollment.deleteMany(), // o classroomEnrollment
    prisma.classroom.deleteMany(),
    prisma.user.deleteMany(),
    prisma.authorizedUser.deleteMany(),
  ]);

  console.log('Base de datos limpiada correctamente.');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });