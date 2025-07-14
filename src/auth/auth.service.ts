import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(nickname: string, password: string) {
    const existingUser = await this.usersService.findByNickname(nickname);
    if (existingUser) {
      throw new ConflictException('Nickname already exists');
    }

    const user = await this.usersService.create(nickname, password);
    const payload = { sub: user.id, nickname: user.nickname };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nickname: user.nickname,
        points: user.points,
      },
    };
  }

  async login(nickname: string, password: string) {
    const user = await this.usersService.findByNickname(nickname);
    if (!user || !(await this.usersService.validatePassword(user, password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, nickname: user.nickname };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nickname: user.nickname,
        points: user.points,
      },
    };
  }
}
