import type { MonthlyData } from './MonthlyData';
export type EntryListProps = { data: MonthlyData | null; month: string; error: string; loading: boolean; onRetry: () => void };
