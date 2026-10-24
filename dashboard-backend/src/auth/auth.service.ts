import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/PrismaService';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'; // Nativo do Node para gerar o token
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO } from './authDTO/login';
import { RegisterDto } from './authDTO/register';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mailerService: MailerService,
  ) {}

  private async hashData(data: string) {
    return bcrypt.hash(data, 12);
  }

  // --- MÉTODOS EXISTENTES ---

  async register(dto: RegisterDto) {
    const company = await this.prisma.company.create({
      data: {
        name: `${dto.name}'s Company`,
        slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
      },
    });
    if (!company) throw new BadRequestException('Company not created');

    const existentUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existentUser) throw new BadRequestException('User already exists');

    const hashedPassword = await this.hashData(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        companyId: company.id,
      },
    });

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role,
      user.companyId,
    );

    const hashedRt = await this.hashData(tokens.refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { hashedRt },
    });

    const { password, hashedRt: _, ...rest } = user;
    return { user: rest, tokens };
  }

  async login(dto: LoginDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('invalid credentials');
    const isPasswordMatch = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatch)
      throw new UnauthorizedException('invalid credentials');
    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role,
      user.companyId,
    );
    await this.prisma.user.update({
      where: { id: user.id },
      data: { hashedRt: await this.hashData(tokens.refreshToken) },
    });
    const { password, hashedRt: _, ...rest } = user;
    return { user: rest, tokens };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: null },
    });
  }

  async getTokens(
    userId: string,
    email: string,
    role: string,
    companyId: string,
  ) {
    const payload = { sub: userId, email, role, companyId };
    const access_token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '10m',
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });
    return { access_token, refreshToken };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.hashedRt)
      throw new UnauthorizedException('invalid credentials');
    const tokenMatches = await bcrypt.compare(refreshToken, user.hashedRt);
    if (!tokenMatches) throw new UnauthorizedException('invalid credentials');
    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role,
      user.companyId,
    );
    const newHashedRt = await this.hashData(tokens.refreshToken);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { hashedRt: newHashedRt },
    });
    return tokens;
  }

  // --- NOVOS MÉTODOS DE ESQUECI A SENHA ---

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Segurança: Não confirmamos se o e-mail existe
    if (!user)
      return {
        message:
          'If you have an account, we will send you an email to reset your password.',
      };

    // 1. Gerar token aleatório
    const token = crypto.randomBytes(32).toString('hex');

    // 2. Definir expiração (1 hora)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // 3. Salvar na tabela passwordReset
    await this.prisma.passwordReset.create({
      data: {
        token,
        email,
        userId: user.id,
        expiresAt,
      },
    });

    // 4. Link do seu frontend (Ajuste para localhost:5173 se estiver em desenvolvimento)
    // 4. Link do seu frontend (Usa a variável de ambiente!)
    const frontendUrl =
      process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    // 5. Envio Real via Nodemailer/Gmail
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Reset - SolveCode',
        html: `
          <div style="background-color: #13131A; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 20px; text-align: center;">
            <h1 style="color: #7C3AED; margin-bottom: 20px;">SolveCode</h1>
            <h2 style="color: #ffffff;">Olá, ${user.name}</h2>
            <p style="color: #9CA3AF; font-size: 16px;">Recebemos uma solicitação para redefinir a sua senha.</p>
            <p style="color: #9CA3AF; font-size: 16px; margin-bottom: 30px;">Clique no botão abaixo para prosseguir com a alteração:</p>
            
            <a href="${resetLink}" style="background-color: #7C3AED; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block;">
              Redefinir Minha Senha
            </a>
            
            <p style="margin-top: 40px; font-size: 12px; color: #6B7280;">
             If you didn't request a password reset, you can ignore this email.<br>
              The link will expire in 1 hour.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending password reset email', error);
      throw new BadRequestException('Error sending password reset email.');
    }

    return { message: 'Reset password link sent successfully.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const resetRecord = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token.');
    }

    const hashedPassword = await this.hashData(newPassword);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordReset.delete({
        where: { token },
      }),
    ]);

    return { message: 'Password reset successful' };
  }
}
