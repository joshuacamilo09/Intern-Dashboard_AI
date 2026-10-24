import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { helmetConfig } from './auth/config/helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(
              ({ timestamp, level, message }) =>
                `${timestamp} [${level}]: ${message}`,
            ),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  });

  const configService = app.get(ConfigService);

  // HELMET
  app.use(helmetConfig());

  // CORS
 const frontendUrl = configService.get<string>('FRONTEND_URL');

 // 2. Agora já podes usar a variável no CORS
 app.enableCors({
   origin: [
     'http://localhost:5173',
     frontendUrl, 
   ].filter(Boolean) as string[], 
   credentials: true,
   methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
   allowedHeaders: ['Content-Type', 'Authorization'],
 });

  // COOKIE PARSER
  app.use(cookieParser());

  // SWAGGER
  if (configService.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Dashboard Analytics API')
      .setDescription('Backend API for company dashboard')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document);
  }

  // CSRF: a API autentica com Bearer token (header Authorization), que o browser não envia
  // sozinho; o único cookie é o refresh token, HttpOnly + SameSite=Lax, que não é enviado em
  // pedidos POST cross-site. Por isso não é preciso um middleware de CSRF adicional.

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
