import { Injectable } from '@nestjs/common';
import { prisma, Appointment, Prisma } from '@repo/db';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AppointmentsService {
    constructor(private notifications: NotificationsService) { }

    async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
        const appointment = await prisma.appointment.create({
            data,
            include: { patient: true, doctor: true }
        });

        // Trigger Notification
        if (appointment.patient) {
            this.notifications.sendPush(
                appointment.patient.userId,
                'Appointment Confirmed',
                `Your appointment with Dr. ${appointment.doctor.lastName} is scheduled for ${new Date(appointment.startTime).toLocaleString()}`
            ).catch(e => console.error("Notification failed", e));
        }

        return appointment;
    }

    async findAllForPatient(patientId: string): Promise<Appointment[]> {
        return prisma.appointment.findMany({
            where: { patientId },
            include: { doctor: true },
            orderBy: { startTime: 'desc' },
        });
    }

    async findAllForDoctor(doctorId: string): Promise<Appointment[]> {
        return prisma.appointment.findMany({
            where: { doctorId },
            include: { patient: true },
            orderBy: { startTime: 'asc' },
        });
    }

    async findOne(id: string): Promise<Appointment | null> {
        return prisma.appointment.findUnique({
            where: { id },
        });
    }
}
