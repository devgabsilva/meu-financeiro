# JavaScript e TypeScript

## Declarações e comparações

Prefira `const`. Use `let` somente quando houver reatribuição necessária; nunca use `var`. Faça comparações com `===` ou `!==`.

```ts
const tipoReceita = 'receita';
function ehReceita(tipo: string): boolean {
  return tipo === tipoReceita;
}
```

## Tipagem

Nunca use `any`. Use tipos explícitos, uniões e `unknown` para dados externos, refinando-os antes do acesso. Tipifique parâmetros e retornos que envolvam objetos. Evite casts que apenas silenciam erros sem validar dados.

```ts
type RespostaErro = { error: string };
function ehRespostaErro(valor: unknown): valor is RespostaErro {
  if (typeof valor !== 'object' || valor === null) return false;
  if (!('error' in valor)) return false;
  return typeof valor.error === 'string';
}
```

Em produção, mantenha cada tipo principal em seu arquivo na pasta `types`. Use nomes de domínio claros e `import type` para dependências apenas de tipos.

## Funções e callbacks

Prefira declarações `function` para funções principais do arquivo. Use arrow functions em callbacks de `map`, `reduce`, handlers e operações semelhantes. Mantenha assinaturas pequenas e objetos parâmetro quando passar de três argumentos.

```ts
function somarCentavos(lancamentos: Lancamento[]): number {
  return lancamentos.reduce((total, item) => total + item.centavos, 0);
}
```

## Ternários

Ternários podem expressar uma escolha simples. Nunca aninhe ternários; para múltiplas condições, use cláusulas guarda ou funções auxiliares.

```ts
function rotuloTipo(tipo: TipoLancamento): string {
  return tipo === 'receita' ? 'Receita' : 'Despesa';
}
```

## Fronteiras e erros

Valide JSON, parâmetros de URL e respostas externas. Não confie apenas no tipo TypeScript, pois ele não valida em runtime. Diferencie erros de entrada, infraestrutura e cancelamento. Não esconda exceções com `catch` vazio nem exiba detalhes internos ao usuário.

```ts
function mensagemErro(erro: unknown): string {
  if (erro instanceof Error) return erro.message;
  return 'Não foi possível concluir a operação.';
}
```

Não use ponto flutuante para acumular dinheiro; converta a entrada textual validada em centavos e calcule com inteiros seguros. Preserve a data de lançamento como data civil, sem conversões de fuso que mudem seu dia.

## Verificações ao concluir

Rode o linter ao terminar toda tarefa: `npm run lint -- --ignore-pattern .sites-runtime/** --ignore-pattern .wrangler/**`. Execute também `npx tsc --noEmit` e os testes pertinentes. Corrija problemas da alteração, registre falhas preexistentes e não declare aprovação quando houver falhas.

Os novos padrões são requisitos; não significam que todo o código legado já atende a eles. Não desabilite regras nem introduza `any`, comentários de supressão ou compactação de linhas para obter uma aprovação artificial.
