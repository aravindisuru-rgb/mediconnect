import { Injectable } from '@nestjs/common';
import { prisma, Message, Prisma } from '@repo/db';

@Injectable()
export class MessagingService {
    async sendMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
        return prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
            },
        });
    }

    async getConversation(user1Id: string, user2Id: string) {
        return prisma.message.findMany({
            where: {
                OR: [
                    { senderId: user1Id, receiverId: user2Id },
                    { senderId: user2Id, receiverId: user1Id },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    async getInbox(userId: string) {
        // Simple logic to get recent messages from different people
        return prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            orderBy: { createdAt: 'desc' },
            distinct: ['senderId', 'receiverId'], // Simplified
        });
    }
}
