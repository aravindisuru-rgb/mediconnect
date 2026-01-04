import { Injectable } from '@nestjs/common';
import { prisma, InvestigationOrder, Prisma } from '@repo/db';
import { BillingService } from '../billing/billing.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InvestigationsService {
    constructor(
        private billingService: BillingService,
        private notifications: NotificationsService
    ) { }

    async create(data: Prisma.InvestigationOrderCreateInput): Promise<InvestigationOrder> {
        return prisma.investigationOrder.create({
            data,
        });
    }

    async findAllForPatient(patientId: string) {
        return prisma.investigationOrder.findMany({
            where: { patientId },
            include: { results: true, doctor: true, targetLab: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findAllForLab(labId: string) {
        return prisma.investigationOrder.findMany({
            where: {
                targetLabId: labId
            },
            include: { results: true, patient: true, doctor: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateStatus(id: string, status: string, labId: string, results?: any) {
        const order = await prisma.investigationOrder.update({
            where: { id },
            data: {
                status: status as any,
                ...(results ? { results: results } : {})
            },
            include: { patient: true }
        });

        if (status === 'COMPLETED') {
            try {
                await this.billingService.createFromInvestigation(id, labId);
            } catch (e) {
                console.error("Billing failed but results processed", e);
            }

            // Notify Patient
            if (order.patient) {
                this.notifications.sendPush(
                    order.patient.userId,
                    'Lab Results Ready',
                    `Your laboratory test results are now available in your health portal.`
                ).catch(e => console.error("Notification failed", e));
            }
        }

        return order;
    }
}
