import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  createUser(body: any): Promise<User> {
    return this.prisma.user.create({ data: body });
  }

  list() {
    return this.prisma.user.findMany();
  }

  show(id: string) {
    return this.prisma.user.findUnique({ where: { id: Number(id) } });
  }
}
