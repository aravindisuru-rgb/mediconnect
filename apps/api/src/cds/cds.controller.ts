import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CdsService } from './cds.service';

@Controller('cds')
export class CdsController {
    constructor(private cdsService: CdsService) { }

    @Post('check-interactions')
    async checkInteractions(@Body() body: { medications: Array<{ medicationName: string; genericName?: string }> }) {
        return this.cdsService.checkDrugInteractions(body.medications);
    }

    @Post('check-allergies')
    async checkAllergies(
        @Body() body: { patientId: string; medications: Array<{ medicationName: string; genericName?: string }> },
    ) {
        return this.cdsService.checkDrugAllergies(body.patientId, body.medications);
    }

    @Post('check-duplicates')
    async checkDuplicates(@Body() body: { medications: Array<{ medicationName: string; genericName?: string }> }) {
        return this.cdsService.checkDuplicateTherapy(body.medications);
    }

    @Get('allergies/:patientId')
    async getAllergies(@Param('patientId') patientId: string) {
        return this.cdsService.getPatientAllergies(patientId);
    }

    @Post('allergies')
    async addAllergy(@Body() body: any) {
        return this.cdsService.addAllergy(body);
    }

    @Delete('allergies/:id')
    async deleteAllergy(@Param('id') id: string) {
        await this.cdsService.deleteAllergy(id);
        return { success: true };
    }

    @Post('seed-interactions')
    async seedInteractions() {
        await this.cdsService.seedCommonInteractions();
        return { success: true, message: 'Common drug interactions seeded' };
    }
}
