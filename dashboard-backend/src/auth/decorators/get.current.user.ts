import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Retorna o ID do usuário (sub no payload do JWT)
export const GetCurrentUserId = createParamDecorator(
  (_: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.user?.sub;
  },
);

// Retorna o Role do usuário
export const GetCurrentUserRole = createParamDecorator(
  (_: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.user?.role;
  },
);

// 🚀 NOVO: Retorna o ID da Empresa (Tenant)
export const GetCurrentCompanyId = createParamDecorator(
  (_: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.user?.companyId;
  },
);

// Retorna o payload completo do usuário se precisares de tudo
export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user?.[data];
  },
);
