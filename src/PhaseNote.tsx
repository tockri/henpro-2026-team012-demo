import { Cross2Icon } from '@radix-ui/react-icons'
import type { Phase } from './phases'

export type PhaseNoteProps = {
  phase: Phase
  onClose: () => void
}

export const PhaseNote: React.FC<PhaseNoteProps> = ({ phase, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={phase.title}
    >
      <div
        className="relative w-full max-w-[360px] rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="absolute right-3 top-3 text-slate-500"
        >
          <Cross2Icon width={20} height={20} />
        </button>
        <h2 className="mb-2 pr-6 text-base font-semibold text-slate-900">
          {phase.title}
        </h2>
        <p className="text-[14px] leading-relaxed text-slate-600">
          {phase.description}
        </p>
      </div>
    </div>
  )
}
