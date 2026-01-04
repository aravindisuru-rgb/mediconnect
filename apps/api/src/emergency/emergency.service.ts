import { Injectable, Logger } from '@nestjs/common';
import { prisma } from '@repo/db';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class EmergencyService {
    private readonly logger = new Logger(EmergencyService.name);

    constructor(private notifications: NotificationsService) { }

    async breakGlass(doctorId: string, patientId: string, reason: string) {
        // 1. Record the emergency access event
        const log = await prisma.emergencyAccessLog.create({
            data: {
                doctorId,
                patientId,
                reason,
            },
            include: {
                patient: { include: { user: true } },
                doctor: true
            }
        });

        this.logger.warn(`EMERGENCY BREAK-GLASS: Doctor ${doctorId} accessed Patient ${patientId}. Reason: ${reason}`);

        // 2. Notify the patient immediately
        if (log.patient.user) {
            await this.notifications.sendPush(
                log.patient.userId,
                '🚨 Emergency Access Alert',
                `Your medical records were accessed by Dr. ${log.doctor.email} due to an emergency: ${reason}.`
            ).catch(e => this.logger.error("Failed to notify patient of emergency access", e));
        }

        // 3. Return a one-time access token or just confirmation (for simple implementation, we just allow the call)
        return { success: true, logId: log.id };
    }

    async getPatientSummary(patientId: string) {
        // This method provides a high-level summary restricted to emergencies
        return prisma.patientProfile.findUnique({
            where: { id: patientId },
            include: {
                allergies: true,
                medications: { where: { isActive: true } },
                vitals: { orderBy: { recordedAt: 'desc' }, take: 5 },
                prescriptions: { take: 5, orderBy: { createdAt: 'desc' } }
            }
        });
    }
}
