# Meu financeiro

Gerenciador financeiro pessoal em português com receitas, despesas e saldo mensal. Interface React/TypeScript com Tailwind, API Cloudflare Workers e banco D1/SQLite. Valores armazenados em centavos inteiros e consultas parametrizadas.

## Executar

Requer Node.js 22.13 ou superior. Execute a partir desta pasta:

```sh
npm run install:ci
npm run build
```

Antes de usar o banco local, aplique cada migração SQL pendente em `drizzle/`, em ordem. Para a primeira migração:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_open_tombstone.sql
npm run dev
```

Interface e API compartilham `http://127.0.0.1:5173`. O banco de desenvolvimento fica em `.wrangler/state` e é separado da publicação. Para testar o build, use `npm start -- --port 5173`.

## Verificar

```sh
npm run lint
npm run typecheck
npm test
npm run test:coverage
npm run build
npx playwright install chromium
npm run test:e2e
```

Como alternativa ao download do navegador, defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE` com o caminho de um Chromium/Edge instalado. Deixe a porta 5173 livre antes dos E2E: Playwright inicia e encerra o servidor e prepara um banco novo por execução, sem gravar na publicação. As capturas desktop/celular são salvas em `../outputs/` e o relatório em `playwright-report/`.

Vitest verifica regras monetárias, datas, formulários, carregamento, cancelamento, API e persistência SQLite real. Há limites mínimos de 80% para linhas, funções, instruções e ramificações, com limites específicos de frontend e backend. A cobertura inclui pontos de entrada e esquema do banco, sem incluir dependências ou código de infraestrutura do starter.

## Organização e regras

Consulte [AGENTS.md](AGENTS.md) e [.agents/rules/folder-structure.md](.agents/rules/folder-structure.md). A estrutura separa views, componentes, hooks e acesso à API no frontend; rotas HTTP, serviços, repositórios e logging no backend.

O runtime de produção é Workers: não existe servidor HTTP Node próprio nem carregamento de dotenv na aplicação. Segredos, quando necessários, são fornecidos pelo ambiente de hospedagem; nunca são embutidos no frontend.

Em ambientes supervisionados que já iniciaram o servidor isolado com `node scripts/e2e-server.mjs`, defina `FINANCE_E2E_EXTERNAL_SERVER=1` apenas para a execução dos testes. O responsável pelo servidor deve encerrá-lo ao concluir. O modo padrão continua gerenciando o próprio servidor.
