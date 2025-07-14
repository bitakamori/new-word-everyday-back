import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RankingService } from './ranking.service';

@ApiTags('Ranking')
@Controller('ranking')
export class RankingController {
  constructor(private rankingService: RankingService) {}

  @Get()
  @ApiOperation({ summary: 'Obter ranking de usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários ordenada por pontuação', schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        position: { type: 'number' },
        nickname: { type: 'string' },
        points: { type: 'number' },
        wordsCount: { type: 'number' }
      }
    }
  }})
  async getRanking() {
    return this.rankingService.getRanking();
  }
}
