# React

## Componentes

Prefira componentes funcionais pequenos e reutilizáveis, com no máximo 30 linhas físicas. Separe componentes de campos, cartões, resumo e listagem. Não comprima JSX para cumprir o limite.

Use props explícitas. Não propague props com spread, como `<Campo {...props} />`.

```tsx
type CartaoSaldoProps = { valor: string };
function CartaoSaldo({ valor }: CartaoSaldoProps) {
  return (
    <section aria-label="Saldo do mês" className="rounded-xl bg-emerald-900 p-6 text-white">
      <h2 className="text-sm">Saldo do mês</h2>
      <p className="mt-3 text-2xl font-semibold">{valor}</p>
    </section>
  );
}
```

## Estado, hooks e efeitos

Não use `useEffect` para calcular valores derivados de props ou estado. Calcule-os durante renderização; use `useMemo` quando o cálculo for pesado e houver benefício concreto, com dependências completas. Operações leves não precisam de memoização.

```tsx
function useResumo(lancamentos: Lancamento[]): ResumoMensal {
  return useMemo(() => calcularResumo(lancamentos), [lancamentos]);
}
```

Hooks de lógica começam com `use`, como `useLancamentos`. Separe acesso à API em `frontend/services`; o componente recebe estado e ações do hook, sem chamar `fetch` diretamente.

Efeitos são apropriados para sincronização externa. Ao buscar por mês, cancele requisições antigas com `AbortController`, trate carregamento/erros e evite sobrescrever o mês atual com respostas atrasadas. Não remova um efeito necessário só para seguir a regra de evitar efeitos desnecessários.

```tsx
function ListaMensal({ mes }: ListaMensalProps) {
  const { itens, erro, carregando } = useLancamentos(mes);
  if (carregando) return <p role="status">Carregando lançamentos…</p>;
  if (erro) return <p role="alert">{erro}</p>;
  return <ListaLancamentos itens={itens} />;
}
```

Os tipos referenciados nos exemplos devem existir em arquivos próprios na implementação.

## Acessibilidade

Sempre considere e aplique atributos `aria-*` adequados. Use primeiro HTML semântico, rótulos associados e navegação por teclado. Não adicione ARIA redundante ou contraditória. Ligue erros aos campos com `aria-describedby` e `aria-invalid`, e use `role="status"` para sucesso e `role="alert"` para erros.

```tsx
function CampoValor({ erro }: CampoValorProps) {
  return (
    <div>
      <label htmlFor="valor">Valor (R$)</label>
      <input id="valor" inputMode="decimal" aria-invalid={Boolean(erro)}
        aria-describedby={erro ? 'erro-valor' : undefined} required />
      {erro ? <p id="erro-valor" role="alert">{erro}</p> : null}
    </div>
  );
}
```

## Estilos

Use Tailwind para estilizar componentes novos e revisados. Mantenha estados de foco visíveis, contraste, legibilidade e responsividade. Exemplo: `className="grid gap-4 md:grid-cols-3"`. A interface foi migrada para Tailwind, mantendo regras globais apenas para tokens, campos e preferências de movimento reduzido.
