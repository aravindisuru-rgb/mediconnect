import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('messaging')
@UseGuards(AuthGuard('jwt'))
export class MessagingController {
    constructor(private service: MessagingService) { }

    @Post('send')
    async sendMessage(@Body() dto: any, @Request() req: any) {
        return this.service.sendMessage(req.user.id, dto.receiverId, dto.content);
    }

    @Get('conversation/:otherId')
    async getConversation(@Param('otherId') otherId: string, @Request() req: any) {
        return this.service.getConversation(req.user.id, otherId);
    }

    @Get('inbox')
    async getInbox(@Request() req: any) {
        return this.service.getInbox(req.user.id);
    }
}
