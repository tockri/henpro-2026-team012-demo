import { Button, Checkbox } from '@radix-ui/themes'
import { InfoCircledIcon, CheckIcon } from '@radix-ui/react-icons'
import type { Phase, PhaseStatus, PhaseAction } from './phases'

type PhaseDotProps = {
  status: PhaseStatus
  index: number
}

const PhaseDot: React.FC<PhaseDotProps> = ({ status, index }) => {
  if (status === 'done') {
    return (
      <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-sm shadow-emerald-500/40">
        <CheckIcon width={16} height={16} />
      </div>
    )
  }
  if (status === 'current') {
    return (
      <div className="relative flex size-7 items-center justify-center">
        <span className="absolute inline-flex size-7 rounded-full bg-blue-500 animate-pulse-ring" />
        <span className="relative flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-md shadow-blue-500/50">
          {index + 1}
        </span>
      </div>
    )
  }
  return (
    <div className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-400 ring-1 ring-slate-200">
      {index + 1}
    </div>
  )
}

export type PhaseRowProps = {
  phase: Phase
  index: number
  isFirst: boolean
  isLast: boolean
  onOpenNote: () => void
  onAction: (action: PhaseAction) => void
  uploadedActionNames: string[]
}

// アップロード済みなら true（fileUpload 以外は常に false）
const isActionUploaded = (
  action: PhaseAction,
  uploadedActionNames: string[],
): boolean =>
  action.to.kind === 'fileUpload' &&
  uploadedActionNames.includes(action.to.actionName)

export const PhaseRow: React.FC<PhaseRowProps> = ({
  phase,
  index,
  isLast,
  onOpenNote,
  onAction,
  uploadedActionNames,
}) => {
  const isCurrent = phase.status === 'current'
  const isDone = phase.status === 'done'

  const titleColor = isDone
    ? 'text-slate-400'
    : isCurrent
      ? 'text-slate-900 font-bold'
      : 'text-slate-700 font-medium'

  const lineColor = isDone ? 'bg-emerald-300' : 'bg-slate-200'

  return (
    <div className="relative flex gap-3">
      {/* Timeline rail */}
      <div className="relative flex w-7 flex-none flex-col items-center">
        <PhaseDot status={phase.status} index={index} />
        {!isLast && <div className={'my-1 w-[3px] grow rounded-full ' + lineColor} />}
      </div>

      {/* Content */}
      <div className={'min-w-0 flex-1 ' + (isLast ? 'pb-1' : 'pb-4')}>
        <div className="flex min-h-7 items-center gap-2">
          <button
            type="button"
            onClick={onOpenNote}
            className={'text-left text-[15px] ' + titleColor}
          >
            {phase.title}
          </button>
          <button
            type="button"
            onClick={onOpenNote}
            aria-label="説明を表示"
            className={isCurrent ? 'text-blue-600' : 'text-slate-300'}
          >
            <InfoCircledIcon width={17} height={17} />
          </button>
        </div>

        {/* Current phase task card */}
        {isCurrent && (phase.tasks || phase.actions || phase.message) && (
          <div className="mt-2 space-y-2 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-3.5 ring-1 ring-blue-100 animate-fade-in">
            {phase.message && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {phase.message}
              </p>
            )}
            {phase.tasks?.map((task) => (
              <div key={task.id} className="flex items-center gap-2">
                <Checkbox checked={task.done} disabled color="green" />
                <span
                  className={
                    'text-sm ' +
                    (task.done
                      ? 'text-slate-400 line-through'
                      : 'font-medium text-slate-700')
                  }
                >
                  {task.label}
                </span>
              </div>
            ))}
            {phase.actions && (
              <div className="flex flex-col gap-2.5 pt-1">
                {phase.actions.map((action) => {
                  const uploaded = isActionUploaded(action, uploadedActionNames)
                  return (
                    <Button
                      key={action.label}
                      size="3"
                      disabled={uploaded}
                      onClick={() => onAction(action)}
                      className="w-full !bg-gradient-to-r !from-blue-600 !to-indigo-600 !font-semibold shadow-md shadow-blue-500/30 disabled:!opacity-50"
                    >
                      {uploaded ? `${action.label}（提出済み）` : action.label}
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
