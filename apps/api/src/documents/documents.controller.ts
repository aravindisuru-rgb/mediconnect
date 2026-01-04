import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('documents')
@UseGuards(AuthGuard('jwt'))
export class DocumentsController {
    constructor(private service: DocumentsService) { }

    @Post()
    async create(@Body() data: any, @Request() req: any) {
        return this.service.create({
            ...data,
            patient: { connect: { id: req.user.patientId } }
        });
    }

    @Get('patient')
    async findAll(@Request() req: any) {
        return this.service.findAllForPatient(req.user.patientId);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
