import type { MonthController } from '../types/MonthController';
import { useState } from 'react';
import { today } from '../services/format';
import { MONTH_PATTERN } from '../services/constants';

export function useMonth(): MonthController {
  const [month, setMonth] = useState(() => today().slice(0, 7));
  function selectMonth(value: string): void {
    if (MONTH_PATTERN.test(value)) setMonth(value);
  }
  return { month, selectMonth };
}
