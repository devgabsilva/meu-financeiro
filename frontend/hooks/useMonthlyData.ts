import { useEffect, useState } from 'react';
import { errorMessage, loadMonth } from '../services/api';
import type { MonthlySnapshot } from '../types/MonthlySnapshot';
import type { MonthlyController } from '../types/MonthlyController';

export function useMonthlyData(month: string): MonthlyController {
  const [revision, setRevision] = useState(0);
  const [snapshot, setSnapshot] = useState<MonthlySnapshot>({ key: '', data: null, error: '' });
  const key = month + ':' + revision;
  useEffect(() => {
    const controller = new AbortController();
    async function load(): Promise<void> {
      try {
        const data = await loadMonth(month, controller.signal);
        if (!controller.signal.aborted) setSnapshot({ key, data, error: '' });
      } catch (error) {
        if (!controller.signal.aborted) setSnapshot({ key, data: null, error: errorMessage(error) });
      }
    }
    void load();
    return () => controller.abort();
  }, [key, month]);
  const current = snapshot.key === key;
  return {
    data: current ? snapshot.data : null, error: current ? snapshot.error : '', loading: !current,
    reload: () => setRevision((value) => value + 1),
  };
}
