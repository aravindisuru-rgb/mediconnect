import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(private auditService: AuditService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, user, ip, headers } = request;

        // We only want to audit mutations (POST, PATCH, DELETE) for clinical compliance
        // or specific sensitive GET requests (e.g., viewing medical records)
        const isMutation = ['POST', 'PATCH', 'DELETE'].includes(method);
        const isSensitiveRead = method === 'GET' && (url.includes('patients') || url.includes('records'));

        return next.handle().pipe(
            tap((data) => {
                if (isMutation || isSensitiveRead) {
                    this.auditService.log({
                        userId: user?.userId,
                        action: `${method} ${url}`,
                        resource: this.extractResource(url),
                        resourceId: this.extractId(url),
                        changes: isMutation ? body : {},
                        ipAddress: ip,
                        userAgent: headers['user-agent'],
                    }).catch(err => console.error('Audit Logging Failed', err));
                }
            }),
        );
    }

    private extractResource(url: string): string {
        const parts = url.split('/');
        return parts[1] || 'unknown';
    }

    private extractId(url: string): string | undefined {
        const parts = url.split('/');
        return parts[2] && parts[2].length > 20 ? parts[2] : undefined;
    }
}
