import { CheckCircle2, CircleAlert } from 'lucide-react';
import type { NoticeProps } from '../types/NoticeProps';

export function Notice({ message, error = false, onRetry }: NoticeProps) {
  if (!message) return null;
  const Icon = error ? CircleAlert : CheckCircle2;
  return (
    <div role={error ? 'alert' : 'status'} className={'flex items-start gap-2 rounded-xl p-3 text-xs leading-relaxed ' +
      (error ? 'bg-[#fff0e8] text-[#913d27]' : 'bg-[#eef5e7] text-[#32582b]')}>
      <Icon aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
      <div><p>{message}</p>{onRetry ? <button type="button" onClick={onRetry} className="mt-2 font-semibold underline underline-offset-4">Tentar novamente</button> : null}</div>
    </div>
  );
}
