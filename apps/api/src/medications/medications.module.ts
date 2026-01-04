import { Module, Injectable, Controller, Post, Body, Param, UseGuards, BadRequestException, Request } from '@nestjs/common';
import { prisma, MedicationList, Prisma } from '@repo/db';
import { AuthGuard } from '@nestjs/passport';
import { BillingModule } from '../billing/billing.module';
import { BillingService } from '../billing/billing.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MedicationsService {
    constructor(
        private billingService: BillingService,
        private notifications: NotificationsService
    ) { }

    async addFromPrescription(prescriptionId: string, pharmacyId: string) {
        // 1. Fetch Prescription
        const prescription = await prisma.prescription.findUnique({
            where: { id: prescriptionId },
            include: { items: true, patient: true }
        });

        if (!prescription) throw new BadRequestException("Prescription not found");

        if (prescription.status === 'FILLED' || prescription.status === 'PICKED_UP') {
            if (prescription.refillsRemaining <= 0) {
                throw new BadRequestException("Prescription already filled and no refills remaining");
            }
        }

        // 2. Logic for Refills vs First Fill
        let remaining = prescription.refillsRemaining;
        if (prescription.status === 'PENDING') {
            // First fill
        } else {
            remaining = remaining - 1;
        }

        // Update Prescription
        await prisma.prescription.update({
            where: { id: prescriptionId },
            data: {
                status: 'FILLED',
                refillsRemaining: remaining
            }
        });

        // 3. Automated Invoicing
        try {
            await this.billingService.createFromPrescription(prescriptionId, pharmacyId);
        } catch (e) {
            console.error("Billing failed but dispense processed", e);
        }

        // 4. Auto-add to Drug Chart
        const operations = prescription.items.map(async item => {
            return prisma.medicationList.create({
                data: {
                    patientId: prescription.patientId,
                    name: item.medicationName,
                    dosage: item.dosage,
                    frequency: item.frequency,
                    startDate: new Date(),
                    instructions: item.instructions,
                    isActive: true,
                    source: prescription.status === 'PENDING' ? 'PRESCRIPTION_FILL' : `REFILL (${remaining} left)`
                }
            });
        });
        await Promise.all(operations);

        // 5. Notify Patient
        if (prescription.patient) {
            this.notifications.sendPush(
                prescription.patient.userId,
                'Medication Ready',
                `Your prescription has been dispensed by the pharmacy and is ready for pickup.`
            ).catch(e => console.error("Notification failed", e));
        }

        return { success: true, message: `Prescription dispensed. Refills remaining: ${remaining}` };
    }
}

@Controller('medications')
export class MedicationsController {
    constructor(private service: MedicationsService) { }

    @Post('fill-prescription/:id')
    @UseGuards(AuthGuard('jwt'))
    async fillPrescription(@Param('id') id: string, @Request() req: any) {
        return this.service.addFromPrescription(id, req.user.pharmacyId);
    }
}

@Module({
    imports: [BillingModule, NotificationsModule],
    providers: [MedicationsService],
    controllers: [MedicationsController],
    exports: [MedicationsService]
})
export class MedicationsModule { }
