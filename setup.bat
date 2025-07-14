@echo off
REM Script de configuração rápida do projeto Word Game Backend

echo 🚀 Configurando o projeto Word Game Backend...

REM 1. Criar arquivo .env se não existir
if not exist .env (
    echo 📝 Criando arquivo .env...
    copy .env.example .env
    echo ✅ Arquivo .env criado com configurações padrão
) else (
    echo ℹ️  Arquivo .env já existe
)

REM 2. Verificar Docker
echo 🐳 Verificando Docker...
docker --version >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo ✅ Docker encontrado
    echo 📋 Para usar PostgreSQL com Docker:
    echo    npm run docker:db
) else (
    echo ⚠️  Docker não encontrado. Consulte DOCKER_INSTALL.md para instalação
    echo 📋 Ou instale PostgreSQL localmente
)

REM 3. Verificar se PostgreSQL está rodando (apenas informativo)
echo 🐘 Verificando PostgreSQL...
where psql >nul 2>nul
if %ERRORLEVEL% == 0 (
    echo ✅ PostgreSQL CLI encontrado
    echo 📋 Para criar o banco, execute:
    echo    psql -U postgres -c "CREATE DATABASE word_game;"
) else (
    echo ℹ️  PostgreSQL CLI não encontrado (normal se usar Docker)
)

REM 4. Instalar dependências
echo 📦 Instalando dependências...
npm install

REM 5. Compilar projeto
echo 🔨 Compilando projeto...
npm run build

echo.
echo ✨ Configuração concluída!
echo.
echo 📋 Próximos passos:
echo.
echo 🐳 OPÇÃO 1 - Com Docker (Recomendado):
echo 1. Instale Docker Desktop se não tiver (consulte DOCKER_INSTALL.md)
echo 2. Execute: npm run docker:db
echo 3. Execute: npm run start:dev
echo 4. Teste a API em: http://localhost:3000
echo.
echo 🐘 OPÇÃO 2 - PostgreSQL Local:
echo 1. Instale PostgreSQL localmente
echo 2. Crie o banco: CREATE DATABASE word_game;
echo 3. Execute: npm run start:dev
echo 4. Teste a API em: http://localhost:3000
echo.
echo 📖 Consulte os arquivos de documentação:
echo    - API_TESTS.md (exemplos de uso)
echo    - DOCKER_GUIDE.md (comandos Docker)
echo    - DOCKER_INSTALL.md (instalação Docker)

pause
