import { Module } from "@nestjs/common";
import { MedicalAreasService } from "./medical-areas.service";
import { MedicalAreasController } from "./medical-areas.controller";

@Module({
  controllers: [MedicalAreasController],
  providers: [MedicalAreasService],
})
export class MedicalAreaModule {}