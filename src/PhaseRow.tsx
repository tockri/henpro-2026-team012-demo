import { Button, Checkbox } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import type { Phase, PhaseStatus } from './phases'

type PhaseDotProps = {
  status: PhaseStatus
}

const PhaseDot: React.FC<PhaseDotProps> = ({ status }) => {
  if (status === 'current') {
    return (
      <div className="flex size-5 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
        <div className="size-2.5 rounded-full bg-blue-600" />
      </div>
    )
  }
  return (
    <div
      className={
        'size-4 rounded-full ' + (status === 'done' ? 'bg-slate-300' : 'bg-slate-500')
      }
    />
  )
}

export type PhaseRowProps = {
  phase: Phase
  isFirst: boolean
  isLast: boolean
  onOpenNote: () => void
}

export const PhaseRow: React.FC<PhaseRowProps> = ({
  phase,
  isFirst,
  isLast,
  onOpenNote,
}) => {
  const isCurrent = phase.status === 'current'
  const isDone = phase.status === 'done'

  const titleColor = isDone
    ? 'text-slate-400'
    : isCurrent
      ? 'text-slate-900 font-semibold'
      : 'text-slate-800'

  // Connector line color: segments above the current dot are "done" (light),
  // below are "todo" (dark).
  const lineTop = isDone || isCurrent ? 'bg-slate-300' : 'bg-slate-500'
  const lineBottom = isDone ? 'bg-slate-300' : 'bg-slate-500'

  return (
    <div className="relative flex gap-3">
      {/* Timeline rail */}
      <div className="relative flex w-6 flex-none flex-col items-center">
        <div className={'w-[3px] flex-none ' + (isFirst ? 'h-3 bg-transparent' : 'h-3 ' + lineTop)} />
        <PhaseDot status={phase.status} />
        <div className={'w-[3px] grow ' + (isLast ? 'bg-transparent' : lineBottom)} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pb-1">
        <div className="flex min-h-9 items-center gap-2">
          <button
            type="button"
            onClick={onOpenNote}
            className={'text-left text-[15px] ' + titleColor}
          >
            {phase.title}
          </button>
          {isCurrent && (
            <button
              type="button"
              onClick={onOpenNote}
              aria-label="説明を表示"
              className="text-blue-600"
            >
              <InfoCircledIcon width={18} height={18} />
            </button>
          )}
        </div>

        {/* Current phase task card */}
        {isCurrent && phase.tasks && (
          <div className="mt-1 space-y-2 rounded-lg bg-white/70 p-3">
            {phase.tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2">
                <Checkbox checked={task.done} disabled color="green" />
                <span className={task.done ? 'text-slate-800' : 'text-slate-600'}>
                  {task.label}
                </span>
              </div>
            ))}
            {phase.action && (
              <Button size="2" className="mt-1 w-full" color="blue">
                {phase.action.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
