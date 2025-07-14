# Word Game Backend API

Backend NestJS para um jogo de palavras onde usuários podem adicionar palavras validadas por API externa e ganhar pontos.

## Funcionalidades

- 🔐 **Autenticação**: Registro e login com JWT
- 📝 **Gerenciamento de Palavras**: Adicionar palavras verificadas por API de dicionário
- 🏆 **Sistema de Pontuação**: Pontos baseados no número de letras
- 📊 **Ranking**: Lista de usuários ordenada por pontos

## Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Axios** - Requisições HTTP para API externa

## Configuração do Ambiente

### 1. Pré-requisitos

- Node.js (v16 ou superior)
- PostgreSQL
- npm ou yarn

### 2. Configuração do Banco de Dados

Crie um banco de dados PostgreSQL:

```sql
CREATE DATABASE word_game;
```

### 3. Configuração das Variáveis de Ambiente

Edite o arquivo `src/app.module.ts` e configure as credenciais do banco:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'seu_usuario', // Altere aqui
  password: 'sua_senha',   // Altere aqui
  database: 'word_game',
  autoLoadEntities: true,
  synchronize: true, // Apenas para desenvolvimento
}),
```

### 4. Instalação

```bash
# Instalar dependências
npm install

# Compilar o projeto
npm run build

# Executar em modo de desenvolvimento
npm run start:dev
```

## Endpoints da API

### Autenticação

- **POST** `/auth/register` - Registrar usuário
- **POST** `/auth/login` - Login

### Palavras

- **POST** `/words/add` - Adicionar palavra (requer autenticação)
- **GET** `/words/my-words` - Listar palavras do usuário (requer autenticação)

### Ranking

- **GET** `/ranking` - Visualizar ranking de usuários

## Exemplos de Uso

### Registrar usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nickname": "jogador1", "password": "senha123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nickname": "jogador1", "password": "senha123"}'
```

### Adicionar palavra

```bash
curl -X POST http://localhost:3000/words/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"word": "example"}'
```

### Ver ranking

```bash
curl http://localhost:3000/ranking
```

## Estrutura do Projeto

```
src/
├── auth/           # Módulo de autenticação
├── users/          # Módulo de usuários
├── words/          # Módulo de palavras
├── ranking/        # Módulo de ranking
├── app.module.ts   # Módulo principal
└── main.ts         # Arquivo de entrada
```

## Comandos Úteis

```bash
# Executar em modo de desenvolvimento
npm run start:dev

# Executar testes
npm run test

# Executar testes e2e
npm run test:e2e

# Gerar build de produção
npm run build

# Executar em produção
npm run start:prod
```

## Próximos Passos

1. Configurar variáveis de ambiente para segurança
2. Implementar validação mais robusta
3. Adicionar testes unitários e de integração
4. Configurar Docker para facilitar o deploy
5. Implementar rate limiting
6. Adicionar logs estruturados
