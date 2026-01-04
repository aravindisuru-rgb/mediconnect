import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('timeline')
@UseGuards(AuthGuard('jwt'))
export class TimelineController {
    constructor(private service: TimelineService) { }

    @Get()
    async getTimeline(@Request() req: any) {
        // Assume profileId is the patientProfile id for patients
        const patientId = req.user.profileId;
        return this.service.getTimeline(patientId);
    }
}
