import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Word } from '../words/word.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nickname: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  points: number;

  @Column({ default: 0 })
  dailyWordsCount: number;

  @Column({ type: 'date', nullable: true })
  lastWordDate: Date;

  @OneToMany(() => Word, (word: Word) => word.user)
  words: Word[];
}
