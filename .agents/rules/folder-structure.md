# Estrutura de pastas

## Estrutura atual verificada

| Caminho | Papel e tecnologia |
| --- | --- |
| `app/page.tsx` | Ponto de entrada que compõe a view financeira |
| `app/layout.tsx` | Layout, idioma e metadados |
| `app/globals.css` | Tailwind e tokens de design |
| `app/api/entries/route.ts` | Adaptador HTTP GET/POST, Cloudflare Workers |
| `backend/services/` | Validação, intervalo mensal e cálculo do saldo |
| `backend/routes/` | Adaptadores de protocolo HTTP |
| `backend/data/` | Repositório D1 e logging centralizado |
| `frontend/` | Componentes, views, hooks, serviços e tipos |
| `e2e/` | Fluxos completos em Playwright |
| `db/schema.ts` | Esquema Drizzle/SQLite |
| `drizzle/` | Migrações SQL e metadados versionados |
| `components/`, `hooks/` | Componentes e hooks compartilhados do starter |
| `public/` | Arquivos estáticos |
| `frontend/tests/`, `backend/tests/` | Testes Vitest de unidade e integração |
| `build/`, `scripts/` | Integração com a hospedagem e ferramentas |
| `.openai/hosting.json` | Identidade do site e bindings, sem credenciais |
| `.wrangler/`, `.sites-runtime/` | Dados e ferramentas locais, não versionados |

## Organização para evolução

Esta organização está implementada. Preserve os pontos de entrada exigidos pelo App Router, delegando a lógica aos módulos apropriados.

```text
app/
  page.tsx
  api/entries/route.ts
frontend/
  components/
  views/
  services/
  hooks/
  assets/
  types/
  tests/
backend/
  routes/
  services/
  data/
  types/
  tests/
e2e/
db/
drizzle/
.agents/rules/
AGENTS.md
```

- `backend/routes`: protocolo HTTP, extração de entradas e tradução de erros/status. O arquivo em `app/api` delega a esse adaptador.
- `backend/services`: regras de negócio e coordenação; não dependa de componentes React nem de detalhes do protocolo HTTP.
- `backend/data`: repositórios, consultas parametrizadas e acesso a APIs externas quando autorizado. Não mova migrações para dentro dessa pasta.
- `backend/types`: um tipo principal por arquivo, como `Lancamento.ts` e `FiltroMensal.ts`.
- `frontend/components`: componentes pequenos e reutilizáveis.
- `frontend/views`: composição de telas, por exemplo `FinanceiroView.tsx`.
- `frontend/services`: comunicação com a API e conversão de respostas.
- `frontend/hooks`: lógica de estado e coordenação, com nomes iniciados por `use`.
- `frontend/assets`: recursos importados pelos componentes; recursos públicos por URL permanecem em `public/`.
- `frontend/types`: um tipo principal por arquivo; não importe implementações de backend.
- `frontend/tests` e `backend/tests`: testes de unidade e integração, podendo usar subpastas por módulo.
- `e2e`: testes Playwright de fluxos completos, fora do frontend e backend.

Exemplo de dependências: `app/api → backend/routes → backend/services → backend/data`. Na interface: `app/page → frontend/views → components/hooks → frontend/services`. Evite referências circulares e acesso direto do frontend ao banco.
