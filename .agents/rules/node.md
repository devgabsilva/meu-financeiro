# Node e execução no servidor

## Modelo de execução

Este backend roda em Cloudflare Workers, com API Web `Request`/`Response` e binding D1. Não introduza um servidor Node, listener TCP, dotenv ou sinais de processo no Worker. As recomendações de Node abaixo se aplicam a scripts e futuros servidores Node quando esse for o runtime escolhido.

## Assíncrono e event loop

Prefira `async/await` a callbacks. Não bloqueie o event loop com cálculos extensos, loops desnecessários ou APIs síncronas no caminho de uma requisição. Em Node, use workers para CPU pesada quando necessário; em Workers, respeite os limites do runtime e divida tarefas fora do caminho HTTP.

```ts
async function carregarTexto(caminho: string): Promise<string> {
  return await readFile(caminho, 'utf8');
}
```

O exemplo usa `readFile` de `node:fs/promises`, em código exclusivo de Node.

## Ambiente

Em Node, carregue variáveis externas com `import 'dotenv/config'` no ponto de entrada antes de ler `process.env`. Instale `dotenv` se for necessário; ele ainda não é dependência direta do projeto. Valide variáveis obrigatórias e não registre seus valores.

```ts
import 'dotenv/config';
function exigirAmbiente(nome: string): string {
  const valor = process.env[nome];
  if (!valor) throw new Error(`Variável obrigatória ausente: ${nome}`);
  return valor;
}
```

Não empacote `.env`, tokens ou bancos locais. Em Workers, obtenha bindings e segredos do ambiente de execução; não copie credenciais para o frontend.

## Logging centralizado

Use `console.log` e `console.error` apenas em um adaptador centralizado. Os demais módulos chamam o adaptador. Evite dados financeiros detalhados, segredos e payloads completos em logs.

```ts
export const logger = {
  info(evento: string): void {
    console.log(JSON.stringify({ nivel: 'info', evento }));
  },
  error(evento: string): void {
    console.error(JSON.stringify({ nivel: 'error', evento }));
  },
};
```

Exemplo de uso: `logger.error('falha_ao_salvar_lancamento')`. Envie mensagens de erro claras ao usuário e detalhes técnicos sanitizados apenas ao log.

## Encerramento gracioso em servidores Node

Ao usar um servidor HTTP Node, trate `SIGTERM` e `SIGINT`, pare novas conexões, aguarde requisições em andamento, feche recursos e imponha um timeout. Não execute `process.exit()` imediatamente ao receber o sinal.

```ts
const TEMPO_LIMITE_ENCERRAMENTO_MS = 10000;
function registrarEncerramento(servidor: Server): void {
  const encerrar = (): void => {
    const limite = setTimeout(() => process.exit(1), TEMPO_LIMITE_ENCERRAMENTO_MS);
    limite.unref();
    servidor.close((erro?: Error) => {
      clearTimeout(limite);
      process.exitCode = erro ? 1 : 0;
    });
  };
  process.once('SIGTERM', encerrar);
  process.once('SIGINT', encerrar);
}
```

`Server` vem de `node:http`. Se houver pools/consumidores, acrescente seu encerramento aguardado antes de concluir. O callback de `server.close` é uma exigência dessa API, não uma preferência sobre `async/await`. Este exemplo não se aplica ao Worker hospedado: seu ciclo de vida é administrado pela plataforma.

## Dependências

Versione o lockfile e use instalação travada. Evite referências circulares: rotas dependem de serviços, serviços dependem de dados e contratos. Não faça o caminho inverso nem importe frontend no backend.
