export class CaseSummaryResponseDto {
  id!: string;

  title!: string;

  consult!: string;

  isPublished!: boolean;

  createdAt!: Date;

  medicalArea!: {
    id: string,
    name: string;
  } | null;

  usage!: {
    totalAssignments: number;
    activeAssignments: number,
    lastUsedAt: Date | null;
    neverUsed: boolean;
  };
}