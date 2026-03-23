import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MailerModule } from '@nestjs-modules/mailer';

// auth.module.ts
@Module({
  imports: [
    PrismaModule,
    PassportModule,
    // Remova o ConfigModule.forRoot daqui, pois já está no AppModule
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET || 'secret',
      signOptions: { expiresIn: '30m' },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({ // Usando process.env direto para teste de consistência
        transport: {
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT),
          secure: false, 
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: `"SolveCode Support" <${process.env.MAIL_FROM}>`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  exports: [AuthService, PassportModule],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
