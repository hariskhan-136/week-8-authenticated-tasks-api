import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user;
  },
);
