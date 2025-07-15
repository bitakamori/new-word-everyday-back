import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Word } from './word.entity';
import { UsersService } from '../users/users.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
    private usersService: UsersService,
    private httpService: HttpService,
  ) {}

  async addWord(word: string, userId: number) {
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

    // Adicionar pontos ao usuário
    await this.usersService.addPoints(userId, points);

    return {
      word: newWord.word,
      points,
      message: `Palavra adicionada com sucesso! Você ganhou ${points} pontos.`,
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
