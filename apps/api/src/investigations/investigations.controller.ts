import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { InvestigationsService } from './investigations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('investigations')
@UseGuards(AuthGuard('jwt'))
export class InvestigationsController {
    constructor(private service: InvestigationsService) { }

    @Post()
    create(@Body() dto: any, @Request() req: any) {
        return this.service.create({
            clinicalIndication: dto.clinicalIndication,
            testCodes: dto.testCodes,
            fastingRequired: dto.fastingRequired,
            patient: { connect: { id: dto.patientId } },
            doctor: { connect: { id: req.user.profileId } }
        });
    }

    @Get('patient/:id')
    findByPatient(@Param('id') id: string) {
        return this.service.findAllForPatient(id);
    }

    @Get('lab/incoming')
    findForLab(@Request() req: any) {
        const labId = req.user.labId;
        if (!labId) return [];
        return this.service.findAllForLab(labId);
    }

    @Post(':id/status')
    updateStatus(@Param('id') id: string, @Body() body: any, @Request() req: any) {
        return this.service.updateStatus(id, body.status, req.user.labId, body.results);
    }
}
