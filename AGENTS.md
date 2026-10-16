# Instruções do projeto — Meu financeiro

Leia e siga as regras vinculadas antes de alterar o projeto. Este arquivo se aplica a toda a árvore do repositório.

## Produto e tecnologias

Gerenciador financeiro pessoal em português: receitas, despesas, categorias, datas e saldo mensal. Valores são inteiros em centavos; mantenha validação na API, consultas parametrizadas e persistência. Não acrescente autenticação própria, gráficos ou integrações ao escopo sem solicitação.

Frontend: React 19, TypeScript e Vinext/Vite com convenções do Next App Router. Backend: rotas HTTP TypeScript executadas em Cloudflare Workers. Persistência: D1 (SQLite), esquema e migrações com Drizzle. A interface usa Tailwind CSS 4, componentes pequenos e atributos de acessibilidade.

## Mapa e responsabilidades

A descrição detalhada das pastas e a organização desejada estão em [folder-structure.md](.agents/rules/folder-structure.md). Consulte esse documento para localizar frontend, backend, dados e testes. Não duplique a árvore de pastas neste arquivo.

## Ambiente e execução

Execute os comandos a partir desta raiz. Requer Node.js >= 22.13. Versione `package-lock.json`.

| Operação | Comando |
| --- | --- |
| Instalar dependências travadas | `npm run install:ci` |
| Desenvolvimento | `npm run dev` |
| Verificar tipos | `npx tsc --noEmit` |
| Testes de frontend/backend | `npm test` |
| Cobertura com limite mínimo | `npm run test:coverage` |
| Testes E2E em banco isolado | `npm run test:e2e` |
| Linter | `npm run lint -- --ignore-pattern .sites-runtime/** --ignore-pattern .wrangler/**` |
| Gerar migração | `npm run db:generate` |
| Build | `npm run build` |
| Prévia do build | `npm start -- --port 5173` |

Frontend e API usam a mesma origem: desenvolvimento em `http://127.0.0.1:5173`, API em `/api/entries`. Não há processo de backend em porta separada. `npm start` usa Wrangler; sem `--port`, a porta padrão é 8787. O site publicado usa HTTPS na porta 443.

Antes de usar D1 local, faça o build e aplique cada migração pendente, em ordem:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_open_tombstone.sql
```

Aplique apenas migrações ainda não executadas. O banco local fica em `.wrangler/state`; é separado do banco publicado. Não versione dados locais nem segredos.

Em sessões Windows restritas, npm, identificação do usuário e empacotamento podem precisar de ajustes locais. Guarde adaptações em `.sites-runtime/`, sem incorporá-las ao código do produto ou declarar verificações não executadas como aprovadas.

## Regras obrigatórias

- [Padrões de codificação](.agents/rules/code-standards.md)
- [Testes e cobertura](.agents/rules/tests.md)
- [React e acessibilidade](.agents/rules/react.md)
- [Node e execução no servidor](.agents/rules/node.md)
- [Estrutura de pastas](.agents/rules/folder-structure.md)
- [JavaScript e TypeScript](.agents/rules/javascript-typescript.md)

## Estado atual e conclusão de tarefas

Vitest cobre frontend, backend e pontos de entrada. Os limites de 80% em linhas, instruções, funções e ramificações são verificados na configuração, com limites adicionais para frontend e backend. Playwright cria um banco novo por execução e inicia/encerra seu próprio servidor na porta 5173. Faça build antes dos E2E; mantenha essa porta livre. Instale o navegador com `npx playwright install chromium` ou defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE` para um Chromium/Edge existente. Não execute E2E na publicação. Consulte o relatório de cada execução para os números medidos.

Ao concluir uma alteração, rode o linter, os testes pertinentes e a checagem de tipos. Faça build quando houver impacto na aplicação. Informe resultados, falhas preexistentes e limitações reais. Não transforme uma tarefa de documentação em refatoração integral sem necessidade.
