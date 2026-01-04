import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('patients')
@UseGuards(AuthGuard('jwt'))
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) { }

    @Get()
    async findAll() {
        return this.patientsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.patientsService.findOne(id);
    }
}
