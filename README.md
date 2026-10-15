# Meu financeiro

Aplicação em português para receitas, despesas e saldo mensal. Os valores são armazenados em centavos inteiros no banco D1 (SQLite). Não inclui autenticação própria, gráficos nem integrações.

## Desenvolvimento

Requer Node.js 22.13 ou superior. Instale as dependências com `npm run install:ci`, gere migrações com `npm run db:generate` e faça o build com `npm run build`. Aplique as migrações locais seguindo o README do starter e inicie com `npm start`.

## Testes

`node --test tests/finance.test.mjs` verifica campos obrigatórios, datas, valores positivos, precisão monetária e saldos. `python tests/persistence_test.py` verifica o esquema real, consultas parametrizadas, separação mensal e persistência após reabrir o banco.

Os dados locais de desenvolvimento e os dados publicados ficam em bancos separados. O site publicado usa acesso privado do serviço de hospedagem, sem adicionar fluxo de autenticação à aplicação.
