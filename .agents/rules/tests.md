# Regras de testes

## Regra crítica

Todo código próprio deve ser coberto por testes automatizados. Essa regra não deve ser ignorada. Exija pelo menos 80% de cobertura de linhas, instruções, funções e ramificações do código próprio de frontend e backend; avalie os dois conjuntos separadamente, além do total. Cobertura numérica não substitui assertions que comprovem comportamento.

Priorize riscos: precisão monetária, validação da API, persistência, isolamento por mês e saldo são mais críticos que detalhes visuais. Teste também os componentes e seus estados de carregamento, sucesso, erro e lista vazia.

## Ferramentas e estado atual

Use Vitest para testes unitários e de integração. Prefira Playwright nos E2E, na pasta raiz `e2e/`, fora de `frontend/` e `backend/`. Use Testing Library com ambiente DOM nos testes de componentes React e ambiente Node para serviços puros.

A suíte está configurada com Vitest, V8, Testing Library e Playwright. Execute `npm test`, `npm run test:coverage` e, após o build, `npm run test:e2e`. Frontend e backend têm limites de cobertura adicionais na configuração. Os testes E2E criam um banco isolado e não gravam no site publicado.

Exemplo de limite Vitest a incorporar à configuração:

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['frontend/**/*.{ts,tsx}', 'backend/**/*.ts'],
      exclude: ['**/tests/**', '**/*.test.*', '**/types/**'],
      thresholds: { lines: 80, statements: 80, functions: 80, branches: 80 },
    },
  },
});
```

Instale também o provedor de cobertura compatível com a versão do Vitest. Enquanto houver código próprio em `app/`, `lib/` e `db/`, inclua-o na medição; não o esconda por estar fora da organização proposta. Gere relatórios separados por conjunto para exigir 80% em cada camada. Não exclua código de negócio nem arquivos sem testes para aumentar artificialmente a cobertura. Código de terceiros, artefatos gerados e declarações puras de tipos não são código executável próprio a medir.

## FIRST

- **Fast**: prefira unidades rápidas. Use stubs para repositórios ou serviços externos lentos; mantenha integração real com SQLite em uma suíte específica.
- **Independent**: cada teste prepara e limpa seus próprios dados. Nenhum teste depende de outro ter rodado antes.
- **Repeatable**: use relógio fixo, mocks e entradas determinísticas. Não dependa da data atual ou de APIs externas variáveis.
- **Self-validated**: faça assertions sobre retornos, efeitos e erros. Uma exceção inesperada deve reprovar o teste; não use apenas logs.
- **Timely**: a ordem de escrita é livre; escolha a sequência mais eficiente sem eliminar cobertura de requisitos.

Exemplo de unidade com um conceito e AAA:

```ts
import { expect, it } from 'vitest';
import { calcularSaldo } from '../services/calcularSaldo';
it('subtrai despesas em centavos', () => {
  const resumo = { receitas: 10001, despesas: 3002 };
  const saldo = calcularSaldo(resumo);
  expect(saldo).toBe(6999);
});
```

Exemplo de stub de persistência em um teste isolado:

```ts
it('consulta apenas o mês solicitado', async () => {
  const repositorio = { listar: vi.fn().mockResolvedValue([]) };
  const servico = criarConsultaMensal(repositorio);
  await servico.consultar('2026-10');
  expect(repositorio.listar).toHaveBeenCalledWith({ mes: '2026-10' });
});
```

Use `vi` importado de Vitest e tipos explícitos nos contratos reais. Para tempo, restaure sempre o relógio:

```ts
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-15T12:00:00Z'));
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});
```

## Estrutura e pirâmide

Use Given/When/Then ou AAA: preparar contexto, agir, verificar. Um conceito específico por teste; separe valor inválido, data inválida, campos obrigatórios e saldo negativo. Use testes parametrizados para variações do mesmo requisito.

Tenha muitos testes unitários de validação/cálculo, menos testes de integração de API/banco e poucos E2E dos fluxos essenciais. Integração deve verificar consultas reais, persistência após reabrir o banco e separação entre meses. Use banco temporário e feche conexões em `finally`.

No frontend, valide mensagens acessíveis, envio do formulário, falhas da API, carregamento e troca de mês. Em E2E, valide cadastro → resumo atualizado → recarga → dados preservados, além de mês vazio. Configure banco isolado e dados exclusivos por teste; não rode testes que gravam dados no site publicado.

Exemplo Playwright em `e2e/financeiro.spec.ts`, com `baseURL` configurada:

```ts
import { expect, test } from '@playwright/test';
test('mostra o formulário de lançamento', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Novo lançamento' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Adicionar lançamento/ })).toBeEnabled();
});
```

Com a infraestrutura configurada, execute `vitest run --coverage` e `playwright test`. Registre testes, cobertura medida e limitações; falhas não podem ser omitidas.
