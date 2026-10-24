import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/PrismaService';
import { RegisterDto } from 'src/auth/authDTO/register';
import { LoginDTO } from 'src/auth/authDTO/login';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const company = await this.prisma.company.create({
      data: {
        name: 'Company from ' + dto.name,
        slug: dto.name.toLowerCase().replace(/\s+/g, '-'),
      },
    });
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        companyId: company.id,
        email: dto.email,
        name: dto.name,
        password: dto.password,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
    });

    return this.sanitizeUser(user);
  }

  async validateLogin(dto: LoginDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new ForbiddenException('User is inactive');
    }

    return user; // auth.service compara senha e gera tokens
  }

  async updateRefreshToken(userId: string, hashedRt: string) {
    this.ensureActiveUser(userId);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt },
    });
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: null },
    });

    return { message: 'Logout successful' };
  }

  async validateRefreshToken(userId: string, hashedRt: string) {
    this.ensureActiveUser(userId);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.hashedRt) {
      throw new ForbiddenException('Access denied');
    }

    if (user.hashedRt !== hashedRt) {
      throw new ForbiddenException('Invalid refresh token');
    }

    return user;
  }

  async listUsers(requesterId: string, companyID: string) {
    this.ensureActiveUser(requesterId);
    await this.ensureAdmin(requesterId);

    return this.prisma.user.findMany({
      where: {
        companyId: companyID,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async updateMe(userId: string, data: { name?: string; email?: string }) {
    const user = await this.ensureActiveUser(userId);

    // Opcional: Validar se email já existe se for alterado
    if (data.email && data.email !== user.email) {
      const exists = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (exists) throw new ConflictException('Email already in use');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return this.sanitizeUser(updated);
  }

  async updateUserRole(
    requesterId: string,
    targetUserId: string,
    newRole: UserRole,
  ) {
    this.ensureActiveUser(requesterId);
    await this.ensureAdmin(requesterId);

    const updatedUser = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    return this.sanitizeUser(updatedUser);
  }

  async deactivateUser(requesterId: string, targetUserId: string) {
    this.ensureActiveUser(requesterId);
    await this.ensureAdmin(requesterId);

    await this.prisma.user.update({
      where: { id: targetUserId },
      data: { status: UserStatus.INACTIVE, hashedRt: null },
    });

    return { message: 'User deactivated successfully' };
  }

  async createTeamMember(requesterId: string, companyId: string, dto: any) {
    await this.ensureAdmin(requesterId);

    // Verificar se o email já existe no sistema global
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictException('This email is already registered in the system.');
    }

    const hashedPassword = await this.hashData(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        companyId: companyId,
        role: UserRole.VIEWER, 
        status: UserStatus.ACTIVE,
      },
    });

    return this.sanitizeUser(newUser);
  }

  // HELPERS
  private async ensureAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Access denied');
    }
  }

  private async hashData(data: string) {
      return bcrypt.hash(data, 12);
    }

  private sanitizeUser(user: any) {
    const { password, hashedRt, ...safeUser } = user;
    return safeUser;
  }

  async ensureActiveUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.status === UserStatus.INACTIVE) {
      throw new ForbiddenException('Access denied');
    }

    return user;
  }
}
