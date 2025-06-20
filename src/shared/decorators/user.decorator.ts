import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';

interface RequestWithUser {
  user?: Record<string, any>;
}

export const User = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;

    if (!user) throw new NotFoundException('User not found.');

    if (filter) {
      if (!user[filter]) {
        throw new NotFoundException(`User ${filter} not found`);
      }

      return user[filter];
    }

    return user;
  },
);
