import { PrismaService } from "src/prisma/prisma.service";

export async function generateUniqueCode(prisma: PrismaService, length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  while (true) {
    let code = '';

    for (let i = 0; i < length; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    const exists = await prisma.classroom.findUnique({
      where: { code },
    });

    if (!exists) return code;
  }
}