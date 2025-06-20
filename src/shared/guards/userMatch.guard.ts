import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class UserMatchGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const id = req.params.id;
    const user = req.user;

    if (user.id !== Number(id)) {
      throw new UnauthorizedException(
        'You are not allowed to perform this operation',
      );
    }

    return true;
  }
}
