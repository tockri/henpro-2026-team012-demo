import { Cross2Icon, InfoCircledIcon } from '@radix-ui/react-icons'
import type { Phase } from './phases'

export type PhaseNoteProps = {
  phase: Phase
  onClose: () => void
}

const STATUS_LABEL: Record<Phase['status'], string> = {
  done: '完了',
  current: '進行中',
  todo: 'これから',
}

const STATUS_STYLE: Record<Phase['status'], string> = {
  done: 'bg-emerald-100 text-emerald-700',
  current: 'bg-blue-100 text-blue-700',
  todo: 'bg-slate-100 text-slate-500',
}

export const PhaseNote: React.FC<PhaseNoteProps> = ({ phase, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-fade-in sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={phase.title}
    >
      <div
        className="relative w-full max-w-[380px] overflow-hidden rounded-3xl bg-white shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent header */}
        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 px-6 pb-8 pt-6 text-white">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <InfoCircledIcon width={24} height={24} />
          </div>
          <span
            className={
              'mt-4 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ' +
              STATUS_STYLE[phase.status]
            }
          >
            {STATUS_LABEL[phase.status]}
          </span>
          <h2 className="mt-2 text-xl font-bold tracking-tight">{phase.title}</h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30"
        >
          <Cross2Icon width={18} height={18} />
        </button>

        <div className="px-6 pb-7 pt-5">
          <p className="text-[15px] leading-relaxed text-slate-600">
            {phase.description}
          </p>
        </div>
      </div>
    </div>
  )
}
