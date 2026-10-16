import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import Home from '../../app/page';
import Layout, { metadata } from '../../app/layout';
vi.mock('../views/FinanceView', () => ({ FinanceView: () => <div>Visão financeira</div> }));

it('expõe a tela pelo ponto de entrada público', () => {
  render(<Home />);
  expect(screen.getByText('Visão financeira')).toBeVisible();
});

it('define idioma e metadados em português', () => {
  const layout = Layout({ children: 'Conteúdo' });
  expect(layout.props.lang).toBe('pt-BR');
  expect(metadata.title).toBe('Meu financeiro');
});
