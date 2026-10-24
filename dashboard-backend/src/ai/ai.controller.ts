import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/Guards/AuthGuard';

// Definimos uma interface simples para o que esperamos do User no Request (vindo do JWT)
interface RequestWithUser extends Request {
  user: {
    id: string;
    companyId: string;
    role: string;
  };
}

@Controller('ai')
@UseGuards(AuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('deep-analysis')
  @HttpCode(HttpStatus.OK)
  async getAnalysis(
    @Body('message') message: string,
    @Req() req: RequestWithUser,
  ) {
    // 1. O companyId NUNCA deve vir do Body por segurança, mas sim do Token
    const companyId = req.user.companyId; 


    // 2. Chamamos o método de análise profunda que criámos
    return this.aiService.getDeepAnalysis(companyId, message);
  }
}
