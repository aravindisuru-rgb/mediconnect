import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';

@Injectable()
export class NotificationsService {
    async sendSms(userId: string, message: string) {
        // Mocking SMS logic for now
        console.log(`[SMS to ${userId}]: ${message}`);
        return this.saveNotification(userId, 'SMS', 'Clinical Alert', message);
    }

    async sendEmail(userId: string, subject: string, body: string) {
        // Mocking Email logic
        console.log(`[Email to ${userId}]: ${subject} - ${body}`);
        return this.saveNotification(userId, 'EMAIL', subject, body);
    }

    async sendPush(userId: string, title: string, message: string) {
        // Mocking Push Notification
        console.log(`[Push to ${userId}]: ${title} - ${message}`);
        return this.saveNotification(userId, 'PUSH', title, message);
    }

    private async saveNotification(userId: string, type: string, title: string, message: string) {
        return prisma.notification.create({
            data: {
                recipientId: userId,
                type,
                title,
                message: message,
                status: 'SENT'
            }
        });
    }
}
