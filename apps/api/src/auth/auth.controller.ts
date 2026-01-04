import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport'; // You might need to create a local-auth.guard too later for cleaner code

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req: any) {
        // Ideally use DTOs and ValidationPipe
        return this.authService.login(req);
    }

    @Post('register')
    async register(@Body() req: any) {
        return this.authService.register(req);
    }
}
