import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export async function fillForm(): Promise<void> {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Descrição'), 'Mercado');
  await user.type(screen.getByLabelText('Valor (R$)'), '10,01');
  await user.type(screen.getByLabelText('Categoria'), 'Alimentação');
}
