#!/bin/bash

# Script de configuração rápida do projeto New Word Everyday Game Backend

echo "🚀 Configurando o projeto New Word Everyday Game Backend..."

# 1. Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado com configurações padrão"
else
    echo "ℹ️  Arquivo .env já existe"
fi

# 2. Verificar se PostgreSQL está rodando (apenas informativo)
echo "🐘 Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL CLI encontrado"
    echo "📋 Para criar o banco, execute:"
    echo "   psql -U postgres -c 'CREATE DATABASE word_game;'"
else
    echo "⚠️  PostgreSQL CLI não encontrado. Certifique-se de que o PostgreSQL está instalado e rodando."
fi

# 3. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 4. Compilar projeto
echo "🔨 Compilando projeto..."
npm run build

echo ""
echo "✨ Configuração concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o PostgreSQL e crie o banco 'word_game'"
echo "2. Ajuste as configurações no arquivo .env se necessário"
echo "3. Execute: npm run start:dev"
echo "4. Teste a API em: http://localhost:3000"
echo ""
echo "📖 Consulte o arquivo API_TESTS.md para exemplos de uso"
