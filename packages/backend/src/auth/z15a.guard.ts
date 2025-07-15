import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import type { Request as AppRequest } from 'express';


@Injectable()
export class Z15aGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
        const request = ctx.switchToHttp().getRequest<AppRequest>();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const groups = (request.headers['remote-groups'] ?? '') as string;

        if (request.path.startsWith('/health')) {
            return true;
        }

        if (!groups.split(',').map(g => g.trim()).includes('z15a')) {
            throw new ForbiddenException('User is not in z15a group');
        }

        return true;
    }
}
