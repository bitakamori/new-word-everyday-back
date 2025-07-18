import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validação global de dados
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configuração do CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'http://localhost:8080', 
      'http://127.0.0.1:5500',
      'https://new-word-everyday-game.vercel.app', // URL do frontend em produção
      'https://new-word-everyday-game.netlify.app', // URL alternativa do frontend
      'https://new-word-everyday.vercel.app', // URL alternativa do frontend
      'https://new-word-everyday.netlify.app' // URL alternativa do frontend
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Words Game API')
    .setDescription('API para o jogo de palavras com sistema de pontuação e ranking')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? (process.env.NODE_ENV === 'production' ? 3000 : 3001);
  
  await app.listen(port, '0.0.0.0');
  
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  
  console.log(`🚀 Aplicação rodando em: http://${host}:${port}`);
  console.log(`📚 Documentação Swagger disponível em: http://${host}:${port}/api`);
}
bootstrap();
