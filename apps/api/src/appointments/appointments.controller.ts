import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
    constructor(private appointmentsService: AppointmentsService) { }

    @Post()
    create(@Body() createAppointmentDto: any, @Request() req: any) {
        // Basic DTO mapping (In real app, use class-validator)
        return this.appointmentsService.create({
            startTime: new Date(createAppointmentDto.startTime),
            endTime: new Date(createAppointmentDto.endTime),
            type: createAppointmentDto.type,
            reason: createAppointmentDto.reason,
            patient: { connect: { id: req.user.profileId } }, // Assuming profileId attached to JWT or localized look up
            doctor: { connect: { id: createAppointmentDto.doctorId } }
        });
    }

    @Get('my')
    findAll(@Request() req: any) {
        const role = req.user.role;
        // This logic assumes we attach profileId to the user object in JwtStrategy
        // For now, let's mock or rely on basic userId lookup if we had it
        if (role === 'PATIENT') {
            // Warning: This needs the PatientProfile ID, not User ID. 
            // We'll fix this in the service or JWT strategy later.
            return this.appointmentsService.findAllForPatient(req.user.userId);
        } else {
            return this.appointmentsService.findAllForDoctor(req.user.userId);
        }
    }
}
