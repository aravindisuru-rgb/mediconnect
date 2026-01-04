import { Controller, Post, Get, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('emergency')
@UseGuards(AuthGuard('jwt'))
export class EmergencyController {
    constructor(private service: EmergencyService) { }

    @Post('break-glass')
    async breakGlass(@Body() dto: { patientId: string, reason: string }, @Request() req: any) {
        if (req.user.role !== 'DOCTOR') {
            throw new ForbiddenException('Only doctors can initiate emergency break-glass');
        }
        return this.service.breakGlass(req.user.id, dto.patientId, dto.reason);
    }

    @Get('summary/:patientId')
    async getSummary(@Param('patientId') patientId: string, @Request() req: any) {
        // In a real app, check if a break-glass event was recorded recently for this doc/patient
        // For this demo, we trust the role and the prior break-glass call
        if (req.user.role !== 'DOCTOR') {
            throw new ForbiddenException('Restricted to clinical personnel');
        }
        return this.service.getPatientSummary(patientId);
    }
}
