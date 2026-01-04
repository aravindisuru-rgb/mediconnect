import { Injectable } from '@nestjs/common';
import { prisma, Allergy, Prisma } from '@repo/db';

@Injectable()
export class AllergiesService {
    async create(data: Prisma.AllergyCreateInput): Promise<Allergy> {
        return prisma.allergy.create({
            data,
        });
    }

    async findAllForPatient(patientId: string) {
        return prisma.allergy.findMany({
            where: { patientId },
        });
    }

    async remove(id: string) {
        return prisma.allergy.delete({
            where: { id },
        });
    }
}
