import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WordsModule } from './words/words.module';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Rate limiting: 10 requisições por minuto por IP
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minuto
      limit: 10,  // 10 requisições
    }]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'word_game',
      autoLoadEntities: true,
      synchronize: true, // Apenas para desenvolvimento
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      // Configurações para resolver ECONNRESET
      extra: {
        // Configurações de conexão para produção
        max: 20, // máximo de conexões no pool
        min: 5,  // mínimo de conexões no pool
        idle_timeout: 30000, // 30 segundos
        acquire_timeout: 60000, // 60 segundos
        connectionTimeoutMillis: 30000, // timeout de conexão
        idleTimeoutMillis: 30000, // timeout de idle
        // Keep alive para evitar ECONNRESET
        keepAlive: true,
        keepAliveInitialDelayMillis: 0,
      },
      // Retry automático em caso de falha
      retryAttempts: 3,
      retryDelay: 3000, // 3 segundos entre tentativas
    }),
    AuthModule,
    UsersModule,
    WordsModule,
    RankingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
