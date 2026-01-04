import { Injectable } from '@nestjs/common';
import { prisma, Document, Prisma } from '@repo/db';

@Injectable()
export class DocumentsService {
    async create(data: Prisma.DocumentCreateInput): Promise<Document> {
        return prisma.document.create({
            data,
        });
    }

    async findAllForPatient(patientId: string) {
        return prisma.document.findMany({
            where: { patientId },
            orderBy: { uploadedAt: 'desc' },
        });
    }

    async remove(id: string) {
        return prisma.document.delete({
            where: { id },
        });
    }
}
