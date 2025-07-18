import { Injectable, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Word } from './word.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WordsService {
  private logger = new Logger(WordsService.name);
  private readonly DAILY_WORD_LIMIT = 5; // 5 palavras por dia

  constructor(
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    private httpService: HttpService,
  ) {}

  async addWord(word: string, userId: number) {
    // Verificar limite diário
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const userLastDate = user.lastWordDate ? 
      new Date(user.lastWordDate).toISOString().split('T')[0] : null;

    // Reset contador se mudou o dia
    if (userLastDate !== today) {
      user.dailyWordsCount = 0;
      user.lastWordDate = new Date();
    }

    // Verificar se excedeu o limite diário
    if (user.dailyWordsCount >= this.DAILY_WORD_LIMIT) {
      throw new BadRequestException(
        `Limite diário de ${this.DAILY_WORD_LIMIT} palavras atingido. Tente novamente amanhã!`
      );
    }

    // Verificar se a palavra já existe para este usuário
    const existingWord = await this.wordsRepository.findOne({
      where: { word: word.toLowerCase(), userId },
    });

    if (existingWord) {
      throw new ConflictException('Palavra já adicionada por este usuário');
    }

    // Verificar se a palavra existe no dicionário
    try {
      const isValidWord = await this.validateWordInDictionary(word);
      if (!isValidWord) {
        throw new BadRequestException('Palavra não encontrada no dicionário');
      }
    } catch (error) {
      throw new BadRequestException('Está palavra não é válida');
    }

    // Calcular pontos (número de letras)
    const points = word.length;

    // Salvar a palavra
    const newWord = this.wordsRepository.create({
      word: word.toLowerCase(),
      userId,
    });
    await this.wordsRepository.save(newWord);

    // Atualizar contador diário e pontos do usuário
    user.dailyWordsCount += 1;
    user.lastWordDate = new Date();
    await this.usersRepository.save(user);

    // Adicionar pontos ao usuário
    await this.usersService.addPoints(userId, points);

    return {
      word: newWord.word,
      points,
      dailyWordsRemaining: this.DAILY_WORD_LIMIT - user.dailyWordsCount,
      message: `Palavra adicionada com sucesso! Você ganhou ${points} pontos. Restam ${this.DAILY_WORD_LIMIT - user.dailyWordsCount} palavras hoje.`,
    };
  }

  async getDailyStatus(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const today = new Date().toISOString().split('T')[0];
    const userLastDate = user.lastWordDate ? 
      new Date(user.lastWordDate).toISOString().split('T')[0] : null;

    // Reset se mudou o dia
    let dailyCount = user.dailyWordsCount;
    if (userLastDate !== today) {
      dailyCount = 0;
    }

    return {
      dailyWordsUsed: dailyCount,
      dailyWordsRemaining: this.DAILY_WORD_LIMIT - dailyCount,
      dailyLimit: this.DAILY_WORD_LIMIT,
      resetTime: new Date(Date.now() + (24 * 60 * 60 * 1000)), // Próximo reset
    };
  }

  private async validateWordInDictionary(word: string): Promise<boolean> {
    try {
      // Usando uma API de dicionário simples - você pode substituir por outra
      const response = await firstValueFrom(
        this.httpService.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      );
      return response.status === 200 && response.data.length > 0;
    } catch (error) {
      // Se a API retornar 404, a palavra não existe
      if (error.response?.status === 404) {
        return false;
      }
      // Para outros erros, lançar exceção
      throw error;
    }
  }

  async getUserWords(userId: number): Promise<Word[]> {
    return this.wordsRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }
}
