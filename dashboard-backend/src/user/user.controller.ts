import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';

import {
  GetCurrentCompanyId,
  GetCurrentUserId,
} from 'src/auth/decorators/get.current.user';
import { UpdateUserRoleDto } from './dto/update.role';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/Guards/AuthGuard';
import { RolesGuard } from 'src/auth/Guards/roles.guards'; // ✅ Importado
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RegisterConvidadoDto } from './dto/registerConvidado';

@ApiTags('Users') // Alterado para refletir a funcionalidade
@ApiBearerAuth('access-token')
// ✅ Adicionado RolesGuard para validar os cargos
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // ✅ Permitir que toda a equipa veja quem faz parte dela
  @Get()
  @Roles('ADMIN', 'MANAGER', 'VIEWER')
  listUsers(
    @GetCurrentCompanyId() companyID: string,
    @GetCurrentUserId() requesterId: string,
  ) {
    return this.userService.listUsers(requesterId, companyID);
  }

  // ❌ Apenas ADMIN pode alterar cargos de outros
  @Patch(':id/role')
  @Roles('ADMIN')
  updateUserRole(
    @GetCurrentUserId() requesterId: string,
    @Param('id', ParseUUIDPipe) targetUserId: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.userService.updateUserRole(requesterId, targetUserId, dto.role);
  }

  // ✅ Qualquer um pode editar o próprio perfil
  @Patch('me')
  @Roles('ADMIN', 'MANAGER', 'VIEWER')
  updateMe(
    @GetCurrentUserId() userId: string,
    @Body() dto: { name?: string; email?: string },
  ) {
    return this.userService.updateMe(userId, dto);
  }

  // ❌ Apenas ADMIN pode desativar membros
  @Patch(':id/deactivate')
  @Roles('ADMIN')
  deactivateUser(
    @GetCurrentUserId() requesterId: string,
    @Param('id', ParseUUIDPipe) targetUserId: string,
  ) {
    return this.userService.deactivateUser(requesterId, targetUserId);
  }

  @Post('logout')
  @Roles('ADMIN', 'MANAGER', 'VIEWER')
  logout(@GetCurrentUserId() userId: string) {
    return this.userService.logout(userId);
  }

  // ❌ Apenas ADMIN pode convidar novos membros
  @Post('invite')
  @Roles('ADMIN')
  async inviteMember(
    @GetCurrentUserId() requesterId: string,
    @GetCurrentCompanyId() companyId: string,
    @Body() dto: RegisterConvidadoDto,
  ) {
    return this.userService.createTeamMember(requesterId, companyId, dto);
  }
}
