import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { AuthLoginDTO } from './domain/dto/authLogin.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.services';
import { CreateUserDTO } from '../users/domain/dto/createUser.dto';
import { AuthRegisterDTO } from './domain/dto/authRegister.dto';
import { AuthResetPasswordDTO } from './domain/dto/authResetPassword.dto';
import { JwtPayload, ValidateTokenDTO } from './domain/dto/validateToken.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { templateHTML } from './utils/templateHTML';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  async generateJwtToken(user: User, expiresIn: string = '1d') {
    const payload = { sub: user.id, name: user.name };
    const options = {
      expiresIn: expiresIn,
      issuer: 'dnc_hotel',
      audience: 'users',
    };

    return { access_token: await this.jwtService.signAsync(payload, options) };
  }

  async login({ email, password }: AuthLoginDTO) {
    const user = await this.userService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
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

  async reset({ token, password }: AuthResetPasswordDTO) {
    const { valid, decoded } = await this.validateToken(token);

    if (!valid || typeof decoded === 'undefined') {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userService.update(Number(decoded.sub), {
      password,
    });

    return await this.generateJwtToken(user);
  }

  async forgot(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email is incorrect');
    }

    const token = await this.generateJwtToken(user, '30m');

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password - DNC Hotel',
      html: templateHTML(user.name, token.access_token),
    });

    return `A verification code has been sent to ${email}`;
  }

  async validateToken(token: string): Promise<ValidateTokenDTO> {
    try {
      const decoded = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
        issuer: 'dnc_hotel',
        audience: 'users',
      });

      return { valid: true, decoded };
    } catch (error) {
      const err = error as Error;
      return { valid: false, message: err.message };
    }
  }
}
