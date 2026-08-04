import { PrismaClient } from '@prisma/client';

export async function seedMedicalAreas(prisma: PrismaClient) {
  const areas = [
    {
      name: 'Urgencias',
      description: 'Atención inicial y emergencias médicas',
      icon: 'ambulance',
      color: '#ef4444',
    },
    {
      name: 'Neurología',
      description: 'Sistema nervioso',
      icon: 'brain',
      color: '#8b5cf6',
    },
    {
      name: 'Cardiología',
      description: 'Enfermedades cardiovasculares',
      icon: 'heart-pulse',
      color: '#dc2626',
    },
    {
      name: 'Traumatología',
      description: 'Lesiones musculoesqueléticas',
      icon: 'bone',
      color: '#f97316',
    },
    {
      name: 'Pediatría',
      description: 'Atención infantil',
      icon: 'baby',
      color: '#22c55e',
    },
  ];

  for (const area of areas) {
    await prisma.medicalArea.upsert({
      where: {
        name: area.name,
      },
      update: {},
      create: area,
    });
  }

  console.log('✔ Medical Areas');
}