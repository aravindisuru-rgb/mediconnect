import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';

@Injectable()
export class AuditService {
    async log(data: {
        userId?: string;
        action: string;
        resource: string;
        resourceId?: string;
        changes?: any;
        ipAddress?: string;
        userAgent?: string;
    }) {
        return prisma.auditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                resource: data.resource,
                resourceId: data.resourceId,
                changes: data.changes || {},
                ipAddress: data.ipAddress,
                userAgent: data.userAgent
            }
        });
    }
}
