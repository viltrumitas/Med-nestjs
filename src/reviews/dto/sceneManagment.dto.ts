import { IsInt, Max, Min } from 'class-validator';

export class SceneManagementDto {
  @IsInt()
  @Min(0)
  @Max(2)
  sceneManagement!: number;
  @IsInt()
  @Min(0)
  @Max(2)
  situationManagement!: number;
  @IsInt()
  @Min(0)
  @Max(2)
  safetyManagement!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  resourceRequest!: number;
  @IsInt()
  @Min(0)
  @Max(1)
  overallImpression!: number;
}