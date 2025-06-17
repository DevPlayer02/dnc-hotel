import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const userId = req.params.id;

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (isNaN(Number(userId))) {
      throw new BadRequestException('User ID must be a number');
    }

    next();
  }
}
