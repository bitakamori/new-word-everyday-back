import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class RankingService {
  constructor(private usersService: UsersService) {}

  async getRanking() {
    const users = await this.usersService.findAll();
    return users.map(user => ({
      id: user.id,
      nickname: user.nickname,
      points: user.points,
    }));
  }
}
