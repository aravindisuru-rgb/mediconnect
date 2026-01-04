import { Injectable } from '@nestjs/common';
import { prisma, User, Prisma } from '@repo/db';

@Injectable()
export class UsersService {
    async findOne(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findOneWithProfiles(email: string) {
        return prisma.user.findUnique({
            where: { email },
            include: {
                patientProfile: true,
                doctorProfile: true,
                pharmaProfile: true,
                labProfile: true,
            },
        });
    }

    async createWithProfile(userData: any, profileData: any): Promise<User> {
        const { role } = userData;

        const createData: Prisma.UserCreateInput = {
            ...userData,
        };

        if (role === 'PATIENT') {
            createData.patientProfile = { create: profileData };
        } else if (role === 'DOCTOR') {
            createData.doctorProfile = { create: profileData };
        } else if (role === 'PHARMACIST') {
            createData.pharmaProfile = { create: profileData };
        } else if (role === 'LAB_TECHNICIAN') {
            createData.labProfile = { create: profileData };
        }

        return prisma.user.create({
            data: createData,
        });
    }
}
