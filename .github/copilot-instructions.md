Guia de Desenvolvimento do Backend com NestJS
Bem-vindo ao guia para criar o backend do seu projeto! Este documento vai te orientar na construção de um sistema onde usuários podem fazer login, adicionar palavras verificadas por uma API de dicionário, ganhar pontos com base no número de letras das palavras e visualizar um ranking. Vamos usar o NestJS, um framework poderoso para Node.js, seguindo as melhores práticas e a documentação oficial.
Visão Geral do Projeto
O projeto é um site com as seguintes funcionalidades:

Tela de Login: Usuários criam uma conta ou fazem login com nickname e senha.
Adição de Palavras: Após o login, os usuários adicionam palavras em um input. Cada palavra é:
Verificada por uma API de dicionário para confirmar se existe.
Checada no backend para garantir que não foi adicionada antes.
Adicionada ao banco de dados se válida e não duplicada, com uma mensagem de erro se já existir.

Pontuação: Cada palavra adicionada dá ao usuário pontos iguais ao número de letras (ex.: "sol" = 3 pontos).
Ranking: Exibe uma lista dos usuários ordenada pelos pontos, do maior para o menor.

Anteriormente, as palavras eram salvas no local storage, mas agora vamos movê-las para o backend com um banco de dados.
Requisitos do Sistema
Requisitos Funcionais

Autenticação:
Registro de usuário com nickname e senha.
Login com nickname e senha.

Gerenciamento de Palavras:
Verificar se a palavra existe usando uma API de dicionário.
Verificar se a palavra já foi adicionada no backend.
Adicionar a palavra ao banco de dados se válida e não duplicada.
Retornar uma mensagem se a palavra já existir.
Atribuir pontos ao usuário (1 ponto por letra).

Ranking:
Mostrar uma lista de usuários ordenada pelos pontos totais.

Requisitos Não Funcionais

Usar NestJS com as melhores práticas.
Seguir a documentação oficial do NestJS (disponível em https://docs.nestjs.com/).
Armazenar dados (usuários, palavras, pontos) em um banco de dados.

Arquitetura do Sistema

Framework: NestJS
Banco de Dados: PostgreSQL (um banco relacional robusto e compatível com NestJS).
Autenticação: JWT (JSON Web Tokens) para gerenciar sessões seguras.
API de Dicionário: Usaremos uma API externa para verificar palavras (ex.: https://api.dicionario-aberto.net/, mas você pode escolher outra).

O sistema será organizado em módulos no NestJS para manter o código limpo e modular.
Estrutura do Projeto

Módulo de Autenticação: Gerencia registro e login.
Módulo de Usuários: Armazena e gerencia dados dos usuários.
Módulo de Palavras: Controla a adição e verificação de palavras.
Módulo de Ranking: Calcula e exibe o ranking.

Passos para Desenvolvimento
Siga os passos abaixo usando o Copilot no VSCode. Cada passo inclui instruções para você pedir ao Copilot para gerar o que precisa.

1. Configuração Inicial

Objetivo: Preparar o ambiente e o projeto NestJS.
Instruções:
Instale o NestJS CLI globalmente:npm i -g @nestjs/cli

Crie um novo projeto:nest new meu-projeto-backend

Escolha npm como gerenciador de pacotes quando solicitado.
Entre na pasta:cd meu-projeto-backend

Instale e configure o PostgreSQL com TypeORM:npm install @nestjs/typeorm typeorm pg

No arquivo app.module.ts, configure o TypeORM para conectar ao PostgreSQL (peça ao Copilot para gerar a configuração com host, usuário, senha e database locais).

2. Módulo de Autenticação

Objetivo: Criar o sistema de registro e login com JWT.
Instruções:
Crie o módulo:nest g module auth

Instale dependências de autenticação:npm install @nestjs/passport passport passport-jwt @nestjs/jwt

Peça ao Copilot para:
Criar um serviço de autenticação com métodos de registro e login.
Configurar a estratégia JWT no módulo auth.module.ts.
Criar um controlador com endpoints /auth/register e /auth/login.

3. Módulo de Usuários

Objetivo: Gerenciar os dados dos usuários.
Instruções:
Crie o módulo:nest g module users

Peça ao Copilot para:
Criar uma entidade User com campos: id, nickname (único), password (hash), points (número).
Criar um serviço para gerenciar usuários (ex.: hash de senha com bcrypt).
Criar um controlador com endpoints protegidos por JWT.

4. Módulo de Palavras

Objetivo: Controlar a adição e verificação de palavras.
Instruções:
Crie o módulo:nest g module words

Instale o módulo HTTP para a API externa:npm install @nestjs/axios

Peça ao Copilot para:
Criar uma entidade Word com campos: id, word (texto), userId (relacionado ao usuário).
Criar um serviço que:
Faz uma requisição à API de dicionário para verificar a palavra.
Checa se a palavra já existe no banco.
Adiciona a palavra e calcula pontos (tamanho da palavra) se válida.

Criar um controlador com endpoint /words/add (protegido por JWT).

5. Módulo de Ranking

Objetivo: Exibir o ranking dos usuários.
Instruções:
Crie o módulo:nest g module ranking

Peça ao Copilot para:
Criar um serviço que busca todos os usuários e ordena por points (descendente).
Criar um controlador com endpoint /ranking (acessível a todos).

6. Integração com a API de Dicionário

Objetivo: Verificar palavras usando uma API externa.
Instruções:
No módulo de palavras, peça ao Copilot para:
Criar um serviço separado ou método no serviço existente que usa o HttpService do NestJS para chamar a API (ex.: GET https://api.dicionario-aberto.net/word/{palavra}).
Tratar a resposta para confirmar se a palavra existe.

7. Testes e Finalização

Objetivo: Garantir que tudo funciona.
Instruções:
Peça ao Copilot para gerar testes unitários para cada módulo (use Jest, que já vem com o NestJS).
Teste os endpoints com ferramentas como Postman:
/auth/register e /auth/login.
/words/add (com token JWT).
/ranking.
