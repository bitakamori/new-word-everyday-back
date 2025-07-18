import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20, { message: 'Nickname deve ter entre 3 e 20 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Nickname deve conter apenas letras, números e underscore' })
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 50, { message: 'Senha deve ter entre 6 e 50 caracteres' })
  password: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 registros por minuto
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({ 
    type: RegisterDto,
    examples: {
      example1: {
        summary: 'Exemplo de registro',
        value: {
          nickname: 'usuario123',
          password: 'senha123'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou usuário já existe' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.nickname, registerDto.password);
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 logins por minuto
  @ApiOperation({ summary: 'Fazer login' })
  @ApiBody({ 
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Exemplo de login',
        value: {
          nickname: 'usuario123',
          password: 'senha123'
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso', schema: {
    type: 'object',
    properties: {
      access_token: { type: 'string' },
      user: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          nickname: { type: 'string' },
          points: { type: 'number' }
        }
      }
    }
  }})
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.nickname, loginDto.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário logado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Dados do usuário',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        nickname: { type: 'string' },
        points: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }
}
