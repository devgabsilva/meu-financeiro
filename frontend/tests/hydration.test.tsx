import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { EntryForm } from '../components/EntryForm';
import { MonthSelector } from '../components/MonthSelector';

it('impede envio nativo antes de a interface estar pronta', () => {
  const html = renderToString(<EntryForm onSaved={() => undefined} />);
  expect(html).toContain('disabled=');
});

it('aguarda a interface estar pronta antes de trocar o mês', () => {
  const html = renderToString(<MonthSelector month="2026-10" onChange={() => undefined} />);
  expect(html).toContain('disabled=');
});
