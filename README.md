# ImpactHub — Frontend

Plataforma web voltada à gestão de eventos e iniciativas de ONGs, conectando organizações e comunidade em um único ambiente digital.

## Sobre o Projeto

O ImpactHub nasceu da necessidade de centralizar a gestão de eventos e ações sociais de ONGs, oferecendo uma interface clara para organizações divulgarem suas iniciativas e para usuários acompanharem e participarem delas.

A plataforma permite que ONGs publiquem e gerenciem eventos, enquanto usuários podem descobrir organizações, seguir causas e indicar participação — tudo em um feed dinâmico e intuitivo.

Este repositório contém o frontend da aplicação. O backend está disponível em [impacthub-core](https://github.com/impacthub-devsquad/impacthub-core).

## Funcionalidades

- Autenticação e cadastro de usuários com validação de campos e recuperação de senha
- Feed de ONGs e eventos com busca por nome e filtro por categoria
- Perfil de ONG com lista de eventos, curtidas, comentários e indicação de participação
- Painel administrativo para gestão completa de colaboradores e eventos
- Atribuição de cargos e controle de permissões por ONG

## Telas Mapeadas

| ID | Tela | Ator(es) | Rota |
|----|------|----------|------|
| T01 | Login / Cadastro | Todos | `/login`, `/cadastro` |
| T02 | Home + Busca de ONGs | Usuário | `/home` |
| T03 | Perfil da ONG + Eventos | Usuário, Colaborador | `/ong/:id`, `/evento/:id` |
| T04 | Painel do Administrador | Administrador de ONG | `/ong/:id/gerenciar` |

## Stack Técnica

- **React** + **TypeScript** — base da interface
- **Tailwind CSS** — estilização utilitária
- **Vite** — bundler e ambiente de desenvolvimento
- **shadcn/ui** — componentes de interface
- **Playwright** — testes end-to-end
- **Vitest** — testes unitários
- **Bun** — gerenciador de pacotes

## Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- Bun instalado (`npm install -g bun`)
- Backend rodando ([impacthub-core](https://github.com/impacthub-devsquad/impacthub-core))

### Instalação

```bash
# Clone o repositório
git clone https://github.com/impacthub-devsquad/impacthub-frontend.git
cd impacthub-frontend

# Instale as dependências
bun install

# Inicie o servidor de desenvolvimento
bun run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Testes

```bash
# Testes unitários
bun run test

# Testes end-to-end
bun run test:e2e
```

## Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas da aplicação
├── hooks/          # Custom hooks
├── services/       # Integração com a API
└── types/          # Tipagens TypeScript
```

## Equipe

- [Maria Luisa Sanches](https://github.com/marialuisasanches)
- Josinaldo Junior

## Licença

Este projeto está licenciado sob a licença MIT.
