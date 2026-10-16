import { expect, it } from 'vitest';
import { focusInvalid, validateForm } from '../services/form';
const valid = { type: 'receita', description: 'Salário', amount: '10,01', category: 'Trabalho', date: '2026-10-15' };

it('aceita um formulário completo', () => {
  expect(validateForm(valid)).toEqual({});
});

it.each(['0', '-1', '1,001', 'abc'])('rejeita valor %s', (amount) => {
  expect(validateForm({ ...valid, amount }).amount).toContain('maior que zero');
});

it('valida limite do texto e data ausente', () => {
  expect(validateForm({ ...valid, description: 'x'.repeat(151), date: '' })).toEqual({ description: 'Use até 150 caracteres.', date: 'Informe a data do lançamento.' });
});

it('não falha ao tentar focar um campo inexistente', () => {
  expect(() => focusInvalid(document.createElement('form'), { description: 'Erro' })).not.toThrow();
});
