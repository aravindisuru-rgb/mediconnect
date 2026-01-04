import { Injectable } from '@nestjs/common';
import { prisma, Vital, Prisma } from '@repo/db';

@Injectable()
export class VitalsService {
    async create(data: Prisma.VitalCreateInput): Promise<Vital> {
        return prisma.vital.create({
            data,
        });
    }

    async findAllForPatient(patientId: string) {
        return prisma.vital.findMany({
            where: { patientId },
            orderBy: { recordedAt: 'desc' },
            take: 50
        });
    }

    async getLatest(patientId: string) {
        const types = ['BP_SYSTOLIC', 'BP_DIASTOLIC', 'HEART_RATE', 'TEMP', 'GLUCOSE', 'WEIGHT'];
        const latest: any = {};

        for (const type of types) {
            const val = await prisma.vital.findFirst({
                where: { patientId, type },
                orderBy: { recordedAt: 'desc' }
            });
            latest[type] = val;
        }

        return latest;
    }
}
