# 🐳 Instalação do Docker para Windows

## Pré-requisitos

Você precisa instalar o Docker Desktop para usar os containers.

### 1. Download do Docker Desktop

1. Acesse: https://www.docker.com/products/docker-desktop/
2. Clique em "Download for Windows"
3. Execute o instalador baixado

### 2. Instalação

1. Execute o arquivo `Docker Desktop Installer.exe`
2. Siga as instruções do instalador
3. Reinicie o computador quando solicitado

### 3. Verificação

Após a instalação e reinicialização:

```bash
# Verificar versão
docker --version

# Verificar se está funcionando
docker run hello-world
```

### 4. Configuração (Opcional)

- Abra o Docker Desktop
- Vá em Settings > Resources
- Ajuste RAM e CPU conforme necessário
- Para este projeto, 2GB RAM e 2 CPUs são suficientes

## Uso Rápido Após Instalação

### Opção 1: Apenas PostgreSQL (Recomendado para desenvolvimento)

```bash
# Subir apenas o banco de dados
npm run docker:db

# Verificar se está rodando
docker ps

# Rodar aplicação localmente
npm run start:dev
```

### Opção 2: Aplicação Completa

```bash
# Construir e rodar tudo
npm run docker:full
```

## Comandos Essenciais

```bash
# Subir banco PostgreSQL
npm run docker:db

# Ver containers rodando
docker ps

# Ver logs do banco
npm run docker:logs

# Parar tudo
npm run docker:stop

# Limpar dados (cuidado!)
npm run docker:clean
```

## Acesso ao Banco

**Configuração de conexão:**

- Host: `localhost`
- Porta: `5432`
- Database: `word_game`
- Username: `postgres`
- Password: `postgres`

**Ferramentas recomendadas:**

- pgAdmin 4
- DBeaver
- VS Code extension: PostgreSQL

## Troubleshooting

### Erro: "Docker daemon not running"

1. Abra o Docker Desktop
2. Aguarde inicializar completamente
3. Tente o comando novamente

### Erro: "Port 5432 already in use"

```bash
# Verificar o que está usando a porta
netstat -an | findstr 5432

# Parar PostgreSQL local se estiver rodando
net stop postgresql-x64-*
```

### Performance lenta

1. Abra Docker Desktop
2. Settings > Resources
3. Aumente RAM para 4GB se possível
4. Aumente CPU para 4 cores se possível

## Alternativa: PostgreSQL Local

Se preferir não usar Docker, pode instalar PostgreSQL localmente:

1. Download: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. Configure:
   - Username: `postgres`
   - Password: `postgres`
   - Port: `5432`
4. Crie o banco:
   ```sql
   CREATE DATABASE word_game;
   ```

## Scripts do Projeto

```bash
# Docker commands
npm run docker:db      # Subir PostgreSQL
npm run docker:stop    # Parar containers
npm run docker:logs    # Ver logs
npm run docker:clean   # Limpar dados
npm run docker:full    # Aplicação completa

# Development commands
npm run start:dev      # Rodar app localmente
npm run build         # Compilar
npm test              # Executar testes
```
