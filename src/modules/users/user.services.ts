import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'generated/prisma';
import { CreateUserDTO } from './domain/dto/createUser.dto';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { userSelectFields } from '../prisma/utils/userSelectFields';
import { join, resolve } from 'path';
import { stat, unlink } from 'fs/promises';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateUserDTO): Promise<User> {
    const user = await this.findByEmail(body.email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    body.password = await this.hashPassword(body.password);
    return await this.prisma.user.create({
      data: body,
      select: userSelectFields,
    });
  }

  async list() {
    return await this.prisma.user.findMany({
      select: userSelectFields,
    });
  }

  async show(id: number) {
    const user = await this.isIdExists(id);

    return user;
  }

  async update(id: number, body: UpdateUserDTO) {
    await this.isIdExists(id);

    if (body.password) {
      body.password = await this.hashPassword(body.password);
    }

    return await this.prisma.user.update({
      where: { id },
      data: body,
      select: userSelectFields,
    });
  }

  async delete(id: number) {
    await this.isIdExists(id);

    return await this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async uploadAvatar(id: number, avatarFileName: string) {
    const user = await this.isIdExists(id);
    const oldAvatar = user.avatar;

    const directory = resolve(__dirname, '..', '..', '..', 'uploads');

    const newFilePath = join(directory, avatarFileName);

    let updatedUser;

    try {
      updatedUser = await this.update(id, { avatar: avatarFileName });
    } catch (error) {
      try {
        await unlink(newFilePath);
      } catch {
        // ignora se não existir ou outro erro
      }
      throw error;
    }

    if (oldAvatar) {
      const oldFilePath = join(directory, oldAvatar);
      try {
        await stat(oldFilePath);
        await unlink(oldFilePath);
      } catch {
        // ignora se não existir ou erro; não interrompe o fluxo
      }
    }

    const userUpdated = await this.update(id, { avatar: avatarFileName });

    return userUpdated;
  }

  private async isIdExists(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelectFields,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
