import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class VerificationService {

    /**
     * Verifies Sri Lankan NIC (National Identity Card)
     * Supports both 9-digit (old) and 12-digit (new) formats
     */
    verifyNIC(nic: string): { valid: boolean; gender: string; dob: string } {
        nic = nic.trim().toUpperCase();

        if (nic.length === 10) {
            // Old format: 9 digits + V/X
            const digits = nic.substring(0, 9);
            const letter = nic.charAt(9);
            if (!/^\d{9}$/.test(digits) || !['V', 'X'].includes(letter)) {
                throw new BadRequestException("Invalid legacy NIC format");
            }
            return this.extractDetailsOld(digits);
        } else if (nic.length === 12) {
            // New format: 12 digits
            if (!/^\d{12}$/.test(nic)) {
                throw new BadRequestException("Invalid modern NIC format");
            }
            return this.extractDetailsNew(nic);
        } else {
            throw new BadRequestException("NIC must be 10 or 12 characters long");
        }
    }

    private extractDetailsOld(digits: string) {
        const year = "19" + digits.substring(0, 2);
        let days = parseInt(digits.substring(2, 5));
        const gender = days > 500 ? "FEMALE" : "MALE";
        if (days > 500) days -= 500;

        return { valid: true, gender, dob: this.calculateDOB(year, days) };
    }

    private extractDetailsNew(nic: string) {
        const year = nic.substring(0, 4);
        let days = parseInt(nic.substring(4, 7));
        const gender = days > 500 ? "FEMALE" : "MALE";
        if (days > 500) days -= 500;

        return { valid: true, gender, dob: this.calculateDOB(year, days) };
    }

    private calculateDOB(year: string, days: number): string {
        const date = new Date(parseInt(year), 0); // Jan 1st
        date.setDate(days); // Will handle month overflow automatically
        return date.toISOString().split('T')[0];
    }
}
