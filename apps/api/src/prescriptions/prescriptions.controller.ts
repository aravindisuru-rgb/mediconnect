import { Controller, Post, Body, Get, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('prescriptions')
@UseGuards(AuthGuard('jwt'))
export class PrescriptionsController {
    constructor(private service: PrescriptionsService) { }

    @Post()
    create(@Body() dto: any, @Request() req: any) {
        return this.service.create({
            ...dto,
            doctorId: req.user.profileId
        });
    }

    @Get('patient/:id')
    findByPatient(@Param('id') id: string) {
        // In real app, check if req.user can access this patient
        return this.service.findAllForPatient(id);
    }

    @Get('pharmacy/incoming')
    findForPharmacy(@Request() req: any) {
        if (req.user.role !== 'PHARMACIST') {
            throw new ForbiddenException('Only pharmacists can view incoming queue');
        }

        // Assumption: Pharmacist's profile has a pharmacyId. 
        // Need to ensure this is populated in the JWT payload or fetched
        const pharmacyId = req.user.pharmacyId;

        if (!pharmacyId) {
            // Fallback or error if not linked
            // throw new ForbiddenException('Pharmacist not linked to a pharmacy');
            return []; // Return empty if not linked
        }

        return this.service.findAllForPharmacy(pharmacyId);
    }
}
