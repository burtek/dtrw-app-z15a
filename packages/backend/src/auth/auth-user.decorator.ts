/* eslint n/no-extraneous-import: ['error', { allowModules: ['express'] }] */
import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { Request as AppRequest } from 'express';


export interface AutheliaAuthInfo {
    username: string;
    groups: string[];
}

export const AuthUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): AutheliaAuthInfo => {
        const request = ctx.switchToHttp().getRequest<AppRequest>();

        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const username = request.headers['remote-user'] as string | undefined;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const groupsHeader = request.headers['remote-groups'] as string | undefined;

        return {
            username: username ?? '',
            groups: groupsHeader?.split(',').map(g => g.trim()) ?? []
        };
    }
);
