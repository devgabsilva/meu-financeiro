# Padrões de codificação

Estas regras orientam código novo e alterações de código do projeto. Ao encontrar dívida técnica existente, registre o desvio e adeque o trecho quando ele fizer parte da tarefa.

## Comentários

Não insira comentários que repitam o código. Use nomes claros; comente somente quando absolutamente necessário, como para explicar uma expressão regular complexa ou uma restrição impossível de expressar por nomes.

```ts
const CENTAVOS_POR_REAL = 100;
function paraCentavos(reais: number): number {
  return Math.round(reais * CENTAVOS_POR_REAL);
}
```

O exemplo ilustra uma constante; para entrada monetária textual, prefira converter as partes inteira e decimal sem ponto flutuante.

## Tamanho e responsabilidades

Classes e arquivos `.ts` não podem exceder 100 linhas. Funções e métodos têm no máximo 30 linhas; componentes React também. Conte linhas físicas, incluindo assinatura e fechamento. Não compacte instruções ou JSX para contornar o limite. Separe validação, cálculo, persistência e apresentação.

```ts
function cadastrar(entrada: EntradaLancamento): Promise<Lancamento> {
  const lancamento = validarEntrada(entrada);
  return salvarLancamento(lancamento);
}
```

## Condicionais e cláusulas guarda

Não ultrapasse três níveis de `if/else`. Prefira retornos antecipados.

```ts
function podeSalvar(valorCentavos: number): boolean {
  if (!Number.isSafeInteger(valorCentavos)) return false;
  if (valorCentavos <= 0) return false;
  return true;
}
```

## Parâmetros e objetos

Use no máximo três parâmetros. Agrupe entradas relacionadas em objetos tipados.

```ts
type FiltroMensal = { mes: string; categoria?: string };
function listarLancamentos(filtro: FiltroMensal): Promise<Lancamento[]> {
  return consultarLancamentos(filtro);
}
```

## Espaçamento e proximidade

Não use linhas em branco dentro de funções ou métodos. Entre funções e membros de classes elas são permitidas. Declare cada variável perto de seu primeiro uso.

```ts
function formatarSaldo(centavos: number): string {
  const reais = centavos / CENTAVOS_POR_REAL;
  return formatadorMoeda.format(reais);
}
```

## Constantes

Extraia números e strings de domínio para constantes nomeadas. Não crie constantes artificiais para cada literal sem significado de negócio.

```ts
const MAXIMO_DESCRICAO = 150;
function descricaoValida(descricao: string): boolean {
  return descricao.trim().length <= MAXIMO_DESCRICAO;
}
```

## Segredos

Nunca grave chaves, tokens ou credenciais no código, testes, logs ou commits. No desenvolvimento, use `.env` externo ao código e ignorado pelo Git; documente apenas nomes em um exemplo sem valores reais. Em produção Workers, use os segredos e bindings do ambiente.

```ts
function exigirChave(valor: string | undefined): string {
  if (!valor) throw new Error('Configuração obrigatória ausente');
  return valor;
}
```

Use consultas parametrizadas e validação no servidor. Para dinheiro, armazene centavos inteiros e valide precisão e limites antes de persistir.
