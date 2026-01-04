import { Injectable } from '@nestjs/common';
import { prisma, Allergy, DrugInteraction } from '@repo/db';

interface MedicationCheck {
    medicationName: string;
    genericName?: string;
}

interface InteractionAlert {
    severity: 'CONTRAINDICATED' | 'SERIOUS' | 'MONITOR' | 'MINOR';
    drug1: string;
    drug2: string;
    clinicalEffect: string;
    recommendation: string;
    mechanism?: string;
}

interface AllergyAlert {
    allergen: string;
    severity: string;
    reaction?: string;
    medication: string;
}

@Injectable()
export class CdsService {
    /**
     * Check for drug-drug interactions
     */
    async checkDrugInteractions(medications: MedicationCheck[]): Promise<InteractionAlert[]> {
        if (medications.length < 2) {
            return [];
        }

        const alerts: InteractionAlert[] = [];

        // Check each pair of medications
        for (let i = 0; i < medications.length; i++) {
            for (let j = i + 1; j < medications.length; j++) {
                const med1 = medications[i];
                const med2 = medications[j];

                // Check both directions (drug1-drug2 and drug2-drug1)
                const interactions = await prisma.drugInteraction.findMany({
                    where: {
                        OR: [
                            {
                                AND: [
                                    {
                                        OR: [
                                            { drug1Name: { contains: med1.medicationName, mode: 'insensitive' } },
                                            { drug1Generic: { contains: med1.genericName, mode: 'insensitive' } },
                                        ],
                                    },
                                    {
                                        OR: [
                                            { drug2Name: { contains: med2.medicationName, mode: 'insensitive' } },
                                            { drug2Generic: { contains: med2.genericName, mode: 'insensitive' } },
                                        ],
                                    },
                                ],
                            },
                            {
                                AND: [
                                    {
                                        OR: [
                                            { drug1Name: { contains: med2.medicationName, mode: 'insensitive' } },
                                            { drug1Generic: { contains: med2.genericName, mode: 'insensitive' } },
                                        ],
                                    },
                                    {
                                        OR: [
                                            { drug2Name: { contains: med1.medicationName, mode: 'insensitive' } },
                                            { drug2Generic: { contains: med1.genericName, mode: 'insensitive' } },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                });

                interactions.forEach((interaction) => {
                    alerts.push({
                        severity: interaction.interactionLevel as any,
                        drug1: med1.medicationName,
                        drug2: med2.medicationName,
                        clinicalEffect: interaction.clinicalEffect,
                        recommendation: interaction.recommendation,
                        mechanism: interaction.mechanism || undefined,
                    });
                });
            }
        }

        // Sort by severity (CONTRAINDICATED > SERIOUS > MONITOR > MINOR)
        const severityOrder = { CONTRAINDICATED: 0, SERIOUS: 1, MONITOR: 2, MINOR: 3 };
        alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

        return alerts;
    }

    /**
     * Check for drug-allergy conflicts
     */
    async checkDrugAllergies(patientId: string, medications: MedicationCheck[]): Promise<AllergyAlert[]> {
        // Get patient allergieswith type DRUG
        const allergies = await prisma.allergy.findMany({
            where: {
                patientId,
                allergenType: 'DRUG',
            },
        });

        if (allergies.length === 0) {
            return [];
        }

        const alerts: AllergyAlert[] = [];

        // Check each medication against each allergy
        medications.forEach((med) => {
            allergies.forEach((allergy) => {
                // Simple string matching (in production, use a proper drug database with cross-sensitivity)
                if (
                    med.medicationName.toLowerCase().includes(allergy.allergen.toLowerCase()) ||
                    allergy.allergen.toLowerCase().includes(med.medicationName.toLowerCase()) ||
                    (med.genericName && med.genericName.toLowerCase().includes(allergy.allergen.toLowerCase()))
                ) {
                    alerts.push({
                        allergen: allergy.allergen,
                        severity: allergy.severity,
                        reaction: allergy.reaction || undefined,
                        medication: med.medicationName,
                    });
                }
            });
        });

        return alerts;
    }

    /**
     * Check for duplicate therapy (same therapeutic class)
     * Simplified version - in production, use a drug classification database
     */
    async checkDuplicateTherapy(medications: MedicationCheck[]): Promise<string[]> {
        const warnings: string[] = [];

        // Simple duplicate checking - same drug name
        const seen = new Set<string>();
        medications.forEach((med) => {
            const normalized = med.medicationName.toLowerCase().trim();
            if (seen.has(normalized)) {
                warnings.push(`Duplicate medication detected: ${med.medicationName}`);
            }
            seen.add(normalized);
        });

        // TODO: Add therapeutic class checking with drug database
        // e.g., multiple NSAIDs, multiple statins, etc.

        return warnings;
    }

    /**
     * Get patient allergies
     */
    async getPatientAllergies(patientId: string): Promise<Allergy[]> {
        return prisma.allergy.findMany({
            where: { patientId },
            orderBy: { notedAt: 'desc' },
        });
    }

    /**
     * Add patient allergy
     */
    async addAllergy(data: {
        patientId: string;
        allergen: string;
        allergenType?: string;
        severity: string;
        reaction?: string;
        verifiedBy?: string;
    }): Promise<Allergy> {
        return prisma.allergy.create({
            data: {
                patientId: data.patientId,
                allergen: data.allergen,
                allergenType: data.allergenType || 'DRUG',
                severity: data.severity,
                reaction: data.reaction,
                verifiedBy: data.verifiedBy,
            },
        });
    }

    /**
     * Delete allergy
     */
    async deleteAllergy(id: string): Promise<void> {
        await prisma.allergy.delete({ where: { id } });
    }

    /**
     * Seed some common drug interactions for demo
     * In production, this would be replaced with a comprehensive drug database
     */
    async seedCommonInteractions(): Promise<void> {
        const interactions = [
            {
                drug1Name: 'Warfarin',
                drug2Name: 'Aspirin',
                interactionLevel: 'SERIOUS',
                mechanism: 'Pharmacodynamic synergism',
                clinicalEffect: 'Increased risk of bleeding',
                recommendation: 'Monitor INR closely. Consider alternative antiplatelet if possible.',
            },
            {
                drug1Name: 'Simvastatin',
                drug2Name: 'Clarithromycin',
                interactionLevel: 'CONTRAINDICATED',
                mechanism: 'CYP3A4 inhibition',
                clinicalEffect: 'Increased simvastatin levels, risk of rhabdomyolysis',
                recommendation: 'Avoid combination. Suspend statin during macrolide therapy.',
            },
            {
                drug1Name: 'Metformin',
                drug2Name: 'Contrast Media',
                interactionLevel: 'SERIOUS',
                mechanism: 'Renal excretion impairment',
                clinicalEffect: 'Risk of lactic acidosis if renal function compromised',
                recommendation: 'Hold metformin 48 hours before and after contrast. Check renal function.',
            },
            {
                drug1Name: 'ACE Inhibitors',
                drug1Generic: 'Lisinopril',
                drug2Name: 'Spironolactone',
                interactionLevel: 'MONITOR',
                mechanism: 'Additive hyperkalemia',
                clinicalEffect: 'Risk of elevated potassium levels',
                recommendation: 'Monitor serum potassium regularly.',
            },
            {
                drug1Name: 'SSRIs',
                drug1Generic: 'Fluoxetine',
                drug2Name: 'NSAIDs',
                drug2Generic: 'Ibuprofen',
                interactionLevel: 'MONITOR',
                mechanism: 'Pharmacodynamic',
                clinicalEffect: 'Increased risk of GI bleeding',
                recommendation: 'Consider PPI for gastroprotection. Monitor for GI symptoms.',
            },
        ];

        for (const interaction of interactions) {
            await prisma.drugInteraction.upsert({
                where: {
                    id: `seed-${interaction.drug1Name}-${interaction.drug2Name}`,
                },
                create: {
                    id: `seed-${interaction.drug1Name}-${interaction.drug2Name}`,
                    ...interaction,
                },
                update: interaction,
            });
        }
    }
}
