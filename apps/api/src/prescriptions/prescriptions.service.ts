import { Injectable } from '@nestjs/common';
import { prisma, Prescription, Prisma } from '@repo/db';

@Injectable()
export class PrescriptionsService {
    async create(data: any): Promise<Prescription> {
        return prisma.prescription.create({
            data: {
                patient: { connect: { id: data.patientId } },
                doctor: { connect: { id: data.doctorId } },
                validUntil: data.validUntil,
                isEuFormat: data.isEuFormat ?? true,
                substitutionPermitted: data.substitutionPermitted ?? true,
                pharmacyNote: data.pharmacyNote,
                refillsAuthorized: data.refillsAuthorized ?? 0,
                refillsRemaining: data.refillsAuthorized ?? 0,
                // Privacy: Link to specific target Pharmacy if selected
                ...(data.targetPharmacyId ? { targetPharmacy: { connect: { id: data.targetPharmacyId } } } : {}),
                items: {
                    create: data.items.map((item: any) => ({
                        medicationName: item.medicationName,
                        dosage: item.dosage,
                        frequency: item.frequency,
                        duration: item.duration,
                        instructions: item.instructions
                    }))
                }
            },
            include: { items: true }
        });
    }

    async findAllForPatient(patientId: string) {
        return prisma.prescription.findMany({
            where: { patientId },
            include: { items: true, doctor: true, targetPharmacy: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Strict Privacy: Only show prescriptions targeted to this pharmacy
    async findAllForPharmacy(pharmacyId: string) {
        return prisma.prescription.findMany({
            where: {
                OR: [
                    { targetPharmacyId: pharmacyId },
                    // If we allow "Open" prescriptions, uncomment below:
                    // { targetPharmacyId: null } 
                ]
            },
            include: { items: true, patient: true, doctor: true },
            orderBy: { createdAt: 'desc' },
        });
    }
}
