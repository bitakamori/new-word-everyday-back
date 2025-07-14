import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Word } from './word.entity';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Word]),
    HttpModule,
    UsersModule,
  ],
  providers: [WordsService],
  controllers: [WordsController],
})
export class WordsModule {}
