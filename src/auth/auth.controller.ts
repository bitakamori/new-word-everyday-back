import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

export class RegisterDto {
  nickname: string;
  password: string;
}

export class LoginDto {
  nickname: string;
  password: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
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
}
