import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        // Fetch user with profiles to get the correct profileId
        const userWithProfiles = await this.usersService.findOneWithProfiles(user.email);
        let profileId = null;
        let pharmacyId = null;
        let labId = null;

        if (userWithProfiles) {
            if (userWithProfiles.role === 'PATIENT') profileId = userWithProfiles.patientProfile?.id;
            else if (userWithProfiles.role === 'DOCTOR') profileId = userWithProfiles.doctorProfile?.id;
            else if (userWithProfiles.role === 'PHARMACIST') {
                profileId = userWithProfiles.pharmaProfile?.id;
                pharmacyId = userWithProfiles.pharmaProfile?.pharmacyId;
            }
            else if (userWithProfiles.role === 'LAB_TECHNICIAN') {
                profileId = userWithProfiles.labProfile?.id;
                labId = userWithProfiles.labProfile?.labId;
            }
        }

        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
            profileId,
            pharmacyId,
            labId,
            mfaRequired: user.mfaEnabled // Signal that MFA is needed
        };

        if (user.mfaEnabled) {
            return {
                mfa_required: true,
                mfa_token: this.jwtService.sign({ ...payload, mfa_pending: true }, { expiresIn: '5m' }),
            };
        }

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(data: any) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(data.password, salt);

        const userData = {
            email: data.email,
            passwordHash: hash,
            role: data.role,
            phoneNumber: data.phoneNumber,
        };

        // Create user with nested profile based on role
        return this.usersService.createWithProfile(userData, data.profileData);
    }
}
