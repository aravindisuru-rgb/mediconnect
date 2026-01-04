import { Injectable } from '@nestjs/common';
import { prisma, Referral, Prisma } from '@repo/db';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReferralsService {
    constructor(private notifications: NotificationsService) { }

    async create(data: Prisma.ReferralCreateInput): Promise<Referral> {
        return prisma.referral.create({
            data,
        });
    }

    async findReceived(doctorId: string): Promise<Referral[]> {
        return prisma.referral.findMany({
            where: { toDoctorId: doctorId },
            include: { patient: true, fromDoctor: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(id: string, status: string, report?: string): Promise<Referral> {
        const referral = await prisma.referral.update({
            where: { id },
            data: {
                status,
                specialistReport: report,
                feedbackDate: report ? new Date() : undefined
            },
            include: { fromDoctor: true, toDoctor: true, patient: true }
        });

        if (status === 'COMPLETED' && report) {
            // Notify Referring Doctor
            this.notifications.sendPush(
                referral.fromDoctor.userId,
                'Referral Feedback Received',
                `Specialist feedback received for patient ${referral.patient.firstName}. Review the report in your dashboard.`
            ).catch(e => console.error("Notification failed", e));
        }

        return referral;
    }
}
