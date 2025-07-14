# Script de Teste da API

Este arquivo contém exemplos de como testar todos os endpoints da API.

## 1. Teste de Registro de Usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nickname": "jogador1", "password": "senha123"}'
```

Resposta esperada:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVç...",
  "user": {
    "id": 1,
    "nickname": "jogador1",
    "points": 0
  }
}
```

## 2. Teste de Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nickname": "jogador1", "password": "senha123"}'
```

## 3. Teste de Adicionar Palavra

Substitua `YOUR_TOKEN` pelo token recebido no login:

```bash
curl -X POST http://localhost:3000/words/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"word": "hello"}'
```

Resposta esperada:

```json
{
  "message": "Palavra adicionada com sucesso!",
  "word": "hello",
  "points": 5
}
```

## 4. Teste de Listar Palavras do Usuário

```bash
curl -X GET http://localhost:3000/words/my-words \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 5. Teste de Ranking

```bash
curl -X GET http://localhost:3000/ranking
```

Resposta esperada:

```json
[
  {
    "id": 1,
    "nickname": "jogador1",
    "points": 5
  }
]
```

## 6. Teste de Palavra Duplicada

Tente adicionar a mesma palavra novamente:

```bash
curl -X POST http://localhost:3000/words/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"word": "hello"}'
```

Resposta esperada (erro):

```json
{
  "statusCode": 409,
  "message": "Você já adicionou esta palavra",
  "error": "Conflict"
}
```

## 7. Teste de Palavra Inválida

```bash
curl -X POST http://localhost:3000/words/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"word": "xyzabc123"}'
```

## Configuração do PostgreSQL

Antes de testar, certifique-se de que o PostgreSQL está rodando e o banco foi criado:

```sql
-- Conecte-se ao PostgreSQL como administrador
psql -U postgres

-- Crie o banco de dados
CREATE DATABASE word_game;

-- Crie um usuário (opcional)
CREATE USER word_game_user WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE word_game TO word_game_user;
```

## Iniciando o Servidor

```bash
# Modo de desenvolvimento (com hot reload)
npm run start:dev

# Modo de produção
npm run start:prod
```

O servidor será iniciado em: http://localhost:3000
