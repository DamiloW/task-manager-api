# Task Manager API

Uma API robusta para gerenciamento de tarefas, desenvolvida com foco em boas práticas, escalabilidade e tipagem forte. Este projeto faz parte do meu portfólio de desenvolvimento FullStack.

## Tecnologias Utilizadas

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Validação:** [Zod](https://zod.dev/)
- **Containerização:** [Docker](https://www.docker.com/)

## Funcionalidades Implementadas

- **Usuários:** CRUD completo com senhas seguras e relacionamentos.
- **Tarefas:** CRUD completo vinculado ao ID do usuário dono da tarefa.
- **Paginação:** Sistema de paginação e meta-dados na listagem de tarefas.
- **Segurança:** Validação estrita de dados de entrada utilizando schemas do Zod.

## Arquitetura do Projeto

A aplicação utiliza Docker para isolar o banco de dados e o Prisma como ponte entre o código e o PostgreSQL, garantindo migrações de dados consistentes e seguras.

## Como Executar o Projeto

### Pré-requisitos
- Node.js instalado
- Docker e Docker Compose instalados

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/DamiloW/task-manager-api.git](https://github.com/DamiloW/task-manager-api.git)
   cd task-manager-api

2. **Instalar as dependências:**
    npm install

3. **Subir o Banco de Dados (Docker):**
    docker compose up -d

4. **Rodar as Migrations do Prisma:**
    npx prisma migrate dev

5. **Iniciar o servidor de desenvolvimento:**
    npm run dev

Próximos Passos (Roadmap)
[x] CRUD completo de usuários.
[x] CRUD completo de tarefas com paginação.
[ ] Implementação de Testes Automatizados com Jest.
[ ] Documentação da API com Swagger.
[ ] Implementação de autenticação JWT.

Desenvolvido por Damilo Queiroz - [LinkedIn](https://www.linkedin.com/in/damiloqueiroz/)