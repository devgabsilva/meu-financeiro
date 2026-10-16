import type { MonthlyData } from './MonthlyData';
export type MonthlyController = { data: MonthlyData | null; error: string; loading: boolean; reload: () => void };
