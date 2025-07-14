-- Script de inicialização do banco de dados
-- Este arquivo será executado automaticamente quando o container PostgreSQL iniciar pela primeira vez

-- Criar extensões úteis (opcional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar usuário específico para a aplicação (opcional)
-- CREATE USER word_game_user WITH PASSWORD 'password123';
-- GRANT ALL PRIVILEGES ON DATABASE word_game TO word_game_user;

-- Inserir dados de teste (opcional)
-- Descomente as linhas abaixo se quiser dados de exemplo

-- INSERT INTO "user" (nickname, password, points) VALUES 
-- ('admin', '$2b$10$rONLdQbQyF7zOcJUk1qZ.eKJB3x3Y8YrGzJjN8FZWQX9vH8X7vWkK', 0),
-- ('testuser', '$2b$10$rONLdQbQyF7zOcJUk1qZ.eKJB3x3Y8YrGzJjN8FZWQX9vH8X7vWkK', 10);

-- Criar índices para melhor performance (será criado automaticamente pelo TypeORM)
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_nickname ON "user" (nickname);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_word_user_id ON word (userId);

COMMIT;
