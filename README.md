# Brev.ly

## 📑 Sobre

Sistema web de encurtamento de links com redirecionamento automático e visual moderno. Desenvolvido com React + TypeScript e foco em performance e testabilidade.

<br/>

## 🚀 Funcionalidades

- Encurtamento de URLs personalizadas
- Redirecionamento automático com feedback visual
- Página de erro personalizada (`404`)
- Armazenamento dos links com contagem de acessos
- Interface responsiva com Tailwind CSS
- Testes automatizados com Vitest e Testing Library

<br/>

## 🛠 Tecnologias

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query/v4)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Happy DOM](https://github.com/capricorn86/happy-dom)

<br/>

## 🧪 Testes

O projeto utiliza o Vitest com o Testing Library para testes de componentes e páginas.

<br/>

## 📦 Como rodar

Para executar a aplicação, certifique-se de ter o [Docker](https://www.docker.com/) e o [Docker Compose](https://docs.docker.com/compose/).

### Server

Crie o arquivo .env copiando arquivo .env.example

cp .env.example .env

Preenche o arquivo com suas informações personalizadas

1. Navegue até a pasta do **server**:

```bash
cd server
```

2. Instale as dependências usando o npm:

```bash
npm install
```

3. Construa e inicie os containers:

```bash
docker-compose up --build -d
```

4. Em seguida, execute a migration dentro do container da aplicação:

```bash
docker compose exec app npm run db:migrate
```

Seu servidor deve estar rodando na porta definida (o padrão é 3333).

<hr />

Para executar os testes, siga estes passos:

1. Certifique-se de que o arquivo .env.test esteja configurado com as variáveis de ambiente corretas para testes.

2. Execute o comando para iniciar os testes:

```bash
pnpm run test
```

<br/>

### Web

To run the front-end of the application, follow these steps:

1. Navegue até a pasta web:

```bash
cd web
```

2. Instale as dependências usando o npm:

```bash
npm install
```

3. Tm seguida, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Isso iniciará o front-end e você poderá acessar a aplicação localmente.

<hr />

Execute o seguinte comando para rodar os testes:

```bash
npm run test
```
