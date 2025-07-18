import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';
import { Throttle } from '@nestjs/throttler';
import { WordsService } from './words.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export class AddWordDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 20, { message: 'Palavra deve ter entre 2 e 20 caracteres' })
  @Matches(/^[a-zA-Z]+$/, { message: 'Palavra deve conter apenas letras' })
  word: string;
}

@ApiTags('Words')
@ApiBearerAuth('JWT-auth')
@Controller('words')
export class WordsController {
  constructor(private wordsService: WordsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('daily-status')
  @ApiOperation({ summary: 'Verificar status diário de palavras' })
  @ApiResponse({ 
    status: 200, 
    description: 'Status diário retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        dailyWordsUsed: { type: 'number' },
        dailyWordsRemaining: { type: 'number' },
        dailyLimit: { type: 'number' },
        resetTime: { type: 'string' }
      }
    }
  })
  async getDailyStatus(@Request() req) {
    return this.wordsService.getDailyStatus(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 palavras por minuto
  @ApiOperation({ summary: 'Adicionar nova palavra' })
  @ApiBody({ 
    type: AddWordDto,
    examples: {
      example1: {
        summary: 'Exemplo de palavra',
        value: {
          word: 'programação'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Palavra adicionada com sucesso', schema: {
    type: 'object',
    properties: {
      message: { type: 'string' },
      points: { type: 'number' },
      totalPoints: { type: 'number' }
    }
  }})
  @ApiResponse({ status: 400, description: 'Palavra inválida ou já existe' })
  @ApiResponse({ status: 401, description: 'Token não fornecido ou inválido' })
  async addWord(@Body() addWordDto: AddWordDto, @Request() req) {
    return this.wordsService.addWord(addWordDto.word, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-words')
  @ApiOperation({ summary: 'Listar minhas palavras' })
  @ApiResponse({ status: 200, description: 'Lista de palavras do usuário', schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        word: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' }
      }
    }
  }})
  @ApiResponse({ status: 401, description: 'Token não fornecido ou inválido' })
  async getMyWords(@Request() req) {
    return this.wordsService.getUserWords(req.user.userId);
  }
}
