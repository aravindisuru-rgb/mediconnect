import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { VitalsService } from './vitals.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('vitals')
@UseGuards(AuthGuard('jwt'))
export class VitalsController {
    constructor(private service: VitalsService) { }

    @Post()
    async create(@Body() data: any, @Request() req: any) {
        // Automatically link to patient if doctor is logged in or if patient is logged in
        // For simplicity, we assume req.user.patientId is present if role is patient
        return this.service.create({
            ...data,
            patient: { connect: { id: data.patientId || req.user.patientId } }
        });
    }

    @Get('patient/:id')
    async findAll(@Param('id') id: string) {
        return this.service.findAllForPatient(id);
    }

    @Get('patient/:id/latest')
    async getLatest(@Param('id') id: string) {
        return this.service.getLatest(id);
    }
}
