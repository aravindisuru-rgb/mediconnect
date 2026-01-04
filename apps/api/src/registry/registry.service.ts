import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class RegistryService {

    // Mock database of SLMC registered doctors
    private readonly slmcRegistry = [
        { slmcNumber: '67890', name: 'Dr. Kamal Perera', specialty: 'General Practitioner', status: 'ACTIVE' },
        { slmcNumber: '12345', name: 'Dr. Arul Kumaran', specialty: 'Cardiologist', status: 'ACTIVE' },
        { slmcNumber: '99999', name: 'Dr. Anula Silva', specialty: 'Gynecologist', status: 'ACTIVE' },
    ];

    // Mock database of PHM (Public Health Midwife) Areas in Sri Lanka
    private readonly phmAreas = [
        { areaCode: 'WP-CMB-01', name: 'Colombo 01', phmName: 'Mrs. Jayawardena', contact: '0112345678' },
        { areaCode: 'CP-KND-02', name: 'Kandy Municipal', phmName: 'Mrs. Ratnayake', contact: '0812345678' },
        { areaCode: 'SP-GAL-05', name: 'Galle Fort', phmName: 'Mrs. de Silva', contact: '0912345678' },
    ];

    /**
     * Verifies a doctor's SLMC (Sri Lanka Medical Council) registration
     */
    async verifyDoctor(slmcNumber: string) {
        const doctor = this.slmcRegistry.find(d => d.slmcNumber === slmcNumber);
        if (!doctor) {
            throw new NotFoundException(`SLMC Number ${slmcNumber} not found in national registry`);
        }
        return { verified: true, ...doctor };
    }

    /**
     * Finds PHM support based on area code
     */
    async findPHMSupport(areaCode: string) {
        const area = this.phmAreas.find(a => a.areaCode === areaCode);
        if (!area) {
            throw new NotFoundException(`PHM Area Code ${areaCode} not recognized`);
        }
        return area;
    }

    /**
     * Returns all supported PHM areas for dropdowns
     */
    async getAllPHMAreas() {
        return this.phmAreas;
    }
}
