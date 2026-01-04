import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@repo/db';

@Injectable()
export class PatientsService {
    async findOne(id: string) {
        const patient = await prisma.patientProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        email: true,
                        phoneNumber: true,
                    }
                },
                appointments: {
                    include: { doctor: true },
                    orderBy: { startTime: 'desc' },
                    take: 5
                },
                prescriptions: {
                    include: { items: true, doctor: true },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                referrals: {
                    include: { toDoctor: true },
                    orderBy: { createdAt: 'desc' }
                },
                investigations: {
                    include: { results: true },
                    orderBy: { createdAt: 'desc' }
                },
                medications: {
                    where: { isActive: true },
                    orderBy: { startDate: 'desc' }
                }
            }
        });

        if (!patient) throw new NotFoundException('Patient not found');
        return patient;
    }

    async findAll() {
        return prisma.patientProfile.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                    }
                }
            }
        });
    }
}
