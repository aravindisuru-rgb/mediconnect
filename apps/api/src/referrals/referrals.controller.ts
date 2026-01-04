import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('referrals')
@UseGuards(AuthGuard('jwt'))
export class ReferralsController {
    constructor(private referralsService: ReferralsService) { }

    @Post()
    create(@Body() dto: any, @Request() req: any) {
        return this.referralsService.create({
            priority: dto.priority,
            status: 'PENDING',
            clinicalNotes: dto.notes,
            targetSpecialty: dto.specialty,
            // Linking requires Profile IDs. Implementation detail:
            // We assume the frontend sends patientId, and we derive fromDoctor from Auth
            patient: { connect: { id: dto.patientId } },
            fromDoctor: { connect: { id: req.user.profileId } },
            ...(dto.toDoctorId ? { toDoctor: { connect: { id: dto.toDoctorId } } } : {})
        });
    }

    @Get('received')
    findReceived(@Request() req: any) {
        return this.referralsService.findReceived(req.user.profileId);
    }

    @Patch(':id/feedback')
    updateStatus(@Param('id') id: string, @Body() dto: any) {
        return this.referralsService.updateStatus(id, dto.status, dto.report);
    }
}
