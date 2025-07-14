# 🐳 Docker Commands para Word Game Backend

## Comandos Essenciais

### 1. Apenas o Banco PostgreSQL (Recomendado para desenvolvimento)

```bash
# Iniciar apenas o PostgreSQL
docker-compose up postgres -d

# Parar o PostgreSQL
docker-compose down

# Ver logs do PostgreSQL
docker-compose logs postgres

# Acessar o PostgreSQL via linha de comando
docker exec -it word_game_db psql -U postgres -d word_game
```

### 2. Projeto Completo (App + Banco)

```bash
# Construir e iniciar tudo
docker-compose up --build

# Iniciar em background
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Reconstruir apenas a aplicação
docker-compose build app
```

### 3. Comandos de Manutenção

```bash
# Limpar volumes (CUIDADO: apaga dados do banco)
docker-compose down -v

# Ver status dos containers
docker-compose ps

# Ver logs da aplicação
docker-compose logs app

# Ver logs em tempo real
docker-compose logs -f
```

## Cenários de Uso

### 🎯 Cenário 1: Desenvolvimento Local (Recomendado)

- Use Docker apenas para o PostgreSQL
- Rode a aplicação localmente com `npm run start:dev`

```bash
# 1. Subir apenas o banco
docker-compose up postgres -d

# 2. Instalar dependências (se não fez ainda)
npm install

# 3. Rodar aplicação em modo desenvolvimento
npm run start:dev
```

**Vantagens:**

- Hot reload funcionando
- Debug mais fácil
- Não precisa reconstruir container a cada mudança

### 🎯 Cenário 2: Teste de Produção

- Use Docker para aplicação completa

```bash
# Construir e rodar tudo
docker-compose up --build
```

**Vantagens:**

- Ambiente similar à produção
- Testa o Dockerfile
- Isolamento completo

### 🎯 Cenário 3: CI/CD

```bash
# Construir imagem para deploy
docker build -t word-game-backend .

# Rodar apenas testes
docker run --rm word-game-backend npm test
```

## Configuração de Ambiente

### Variáveis para Docker

O arquivo `docker-compose.yml` já está configurado com:

```yaml
environment:
  DB_HOST: postgres # Nome do serviço Docker
  DB_PORT: 5432
  DB_USERNAME: postgres
  DB_PASSWORD: postgres
  DB_DATABASE: word_game
  JWT_SECRET: your-super-secret-jwt-key-for-development
```

### Para desenvolvimento local (.env)

```bash
DB_HOST=localhost           # localhost quando não usar Docker para app
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=word_game
JWT_SECRET=your-super-secret-jwt-key-for-development
```

## Acesso ao Banco

### Via linha de comando:

```bash
docker exec -it word_game_db psql -U postgres -d word_game
```

### Via ferramentas GUI:

- **Host:** localhost
- **Port:** 5432
- **Database:** word_game
- **Username:** postgres
- **Password:** postgres

### Comandos SQL úteis:

```sql
-- Ver tabelas criadas
\dt

-- Ver dados dos usuários
SELECT * FROM "user";

-- Ver palavras
SELECT * FROM word;

-- Limpar dados (cuidado!)
TRUNCATE "user", word RESTART IDENTITY CASCADE;
```

## Troubleshooting

### Problema: Porta 5432 já em uso

```bash
# Ver o que está usando a porta
netstat -an | findstr 5432

# Parar PostgreSQL local (Windows)
net stop postgresql-x64-13

# Ou mudar a porta no docker-compose.yml
ports:
  - "5433:5432"  # Usar porta 5433 externamente
```

### Problema: Permissão negada

```bash
# No Linux/Mac, pode precisar de sudo
sudo docker-compose up postgres -d
```

### Problema: Container não inicia

```bash
# Ver logs detalhados
docker-compose logs postgres

# Remover volumes e recomeçar
docker-compose down -v
docker-compose up postgres -d
```

## Scripts Rápidos

Adicione estes scripts no `package.json`:

```json
{
  "scripts": {
    "docker:db": "docker-compose up postgres -d",
    "docker:stop": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "docker:clean": "docker-compose down -v"
  }
}
```

Uso:

```bash
npm run docker:db    # Subir banco
npm run docker:stop  # Parar tudo
npm run docker:logs  # Ver logs
npm run docker:clean # Limpar dados
```
