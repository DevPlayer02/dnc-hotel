import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { AuthLoginDTO } from './domain/dto/authLogin.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async generateJwtToken(user: User) {
    const payload = { sub: user.id, name: user.name };
    const options = {
      expiresIn: '1d',
      issuer: 'dnc_hotel',
      audience: 'users',
    };

    return { access_token: await this.jwtService.signAsync(payload, options) };
  }

  async login({ email, password }: AuthLoginDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || (await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    return this.generateJwtToken(user);
  }
}
