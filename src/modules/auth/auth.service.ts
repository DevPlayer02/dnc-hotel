import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from 'generated/prisma';
import { AuthLoginDTO } from './domain/dto/authLogin.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.services';
import { CreateUserDTO } from '../users/domain/dto/createUser.dto';
import { AuthRegisterDTO } from './domain/dto/authRegister.dto';
import { AuthResetPasswordDTO } from './domain/dto/authResetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
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
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    if (!password || !user.password) {
      throw new UnauthorizedException('Credenciais incompletas');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new UnauthorizedException('Email ou senha incorretos');
    }

    return this.generateJwtToken(user);
  }

  async register(body: AuthRegisterDTO) {
    const newUser: CreateUserDTO = {
      name: body.name!,
      email: body.email!,
      password: body.password!,
      role: body.role ?? Role.USER,
    };

    const user = await this.userService.create(newUser);

    return this.generateJwtToken(user);
  }

  async resetPassword({ token, password }: AuthResetPasswordDTO) {
    type JwtPayload = {
      sub: string;
      name?: string;
      iat?: number;
      exp?: number;
      aud?: string;
      iss?: string;
    };
    const decoded: JwtPayload = await this.jwtService.verifyAsync<JwtPayload>(
      token,
      {
        audience: 'users',
        issuer: 'dnc_hotel',
      },
    );

    const user = await this.userService.update(Number(decoded.sub), {
      password,
    });

    return await this.generateJwtToken(user);
  }
}
