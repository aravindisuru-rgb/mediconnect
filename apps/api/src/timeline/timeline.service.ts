import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';

@Injectable()
export class TimelineService {
    async getTimeline(patientId: string) {
        // Fetch appointments, medications, vitals, and lab orders
        const [appointments, medications, vitals, labOrders] = await Promise.all([
            prisma.appointment.findMany({
                where: { patientId },
                include: { doctor: true },
                orderBy: { startTime: 'desc' },
                take: 10
            }),
            prisma.medicationList.findMany({
                where: { patientId },
                orderBy: { startDate: 'desc' },
                take: 10
            }),
            prisma.vital.findMany({
                where: { patientId },
                orderBy: { recordedAt: 'desc' },
                take: 10
            }),
            prisma.investigationOrder.findMany({
                where: { patientId },
                orderBy: { createdAt: 'desc' },
                take: 10
            })
        ]);

        // Merge and sort
        const timeline = [
            ...appointments.map(a => ({
                id: a.id,
                type: 'APPOINTMENT',
                date: a.startTime,
                title: `Consultation with Dr. ${a.doctor.lastName}`,
                status: a.status
            })),
            ...medications.map(m => ({
                id: m.id,
                type: 'MEDICATION',
                date: m.startDate,
                title: `${m.name} (${m.dosage})`,
                status: m.isActive ? 'ACTIVE' : 'INACTIVE'
            })),
            ...vitals.map(v => ({
                id: v.id,
                type: 'VITAL',
                date: v.recordedAt,
                title: `${v.type.replace('_', ' ')}: ${v.value} ${v.unit}`,
                status: 'RECORDED'
            })),
            ...labOrders.map(l => ({
                id: l.id,
                type: 'LAB_ORDER',
                date: l.createdAt,
                title: `Lab Investigation: ${l.clinicalIndication || 'General'}`,
                status: l.status
            }))
        ];

        return timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
}
