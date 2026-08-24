import './index.css'
import { useState } from 'react'
import { Theme, Avatar, Button, Checkbox } from '@radix-ui/themes'
import { InfoCircledIcon, HomeIcon } from '@radix-ui/react-icons'

type PhaseStatus = 'done' | 'current' | 'todo'

type Task = {
  id: string
  label: string
  done: boolean
}

type Phase = {
  id: string
  title: string
  status: PhaseStatus
  description: string
  tasks?: Task[]
  action?: { label: string }
}

const PHASES: Phase[] = [
  {
    id: 'pre-apply',
    title: '仮審査申し込み',
    status: 'done',
    description: '住宅ローンの仮審査をお申し込みいただく最初のステップです。',
  },
  {
    id: 'pre-docs',
    title: '必要書類の準備',
    status: 'done',
    description: '本人確認書類や収入証明書など、仮審査に必要な書類をご準備いただきます。',
  },
  {
    id: 'pre-review',
    title: '仮審査',
    status: 'done',
    description: '銀行がご提出内容をもとに仮審査を行います。',
  },
  {
    id: 'pre-result',
    title: '仮審査結果連絡',
    status: 'done',
    description: '仮審査の結果をご連絡いたします。',
  },
  {
    id: 'meeting',
    title: 'ご面談',
    status: 'current',
    description:
      'ご来店またはWebでの面談を予約し、担当者と今後の手続きについてご相談いただきます。',
    tasks: [
      { id: 'reserve', label: 'ご来店Web予約', done: true },
      { id: 'meeting-date', label: '2026年8月20日 ご面談', done: false },
    ],
    action: { label: '面談の予約を確認する' },
  },
  {
    id: 'main-apply',
    title: '本審査申し込み',
    status: 'todo',
    description: '正式なローン契約に向けた本審査をお申し込みいただきます。',
  },
  {
    id: 'main-docs',
    title: '必要書類の準備',
    status: 'todo',
    description: '本審査に必要な書類をご準備いただきます。',
  },
  {
    id: 'contract',
    title: 'ご契約',
    status: 'todo',
    description: '融資条件をご確認のうえ、ローン契約を締結します。',
  },
  {
    id: 'mortgage',
    title: '抵当権設定',
    status: 'todo',
    description: 'ご購入物件に抵当権を設定する手続きを行います。',
  },
  {
    id: 'execution',
    title: '融資実行',
    status: 'todo',
    description: 'ご指定の口座へ融資金が振り込まれ、お手続きが完了します。',
  },
]

function PhaseDot({ status }: { status: PhaseStatus }) {
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

function PhaseRow({
  phase,
  isFirst,
  isLast,
  expanded,
  onToggle,
}: {
  phase: Phase
  isFirst: boolean
  isLast: boolean
  expanded: boolean
  onToggle: () => void
}) {
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
            onClick={onToggle}
            className={'text-left text-[15px] ' + titleColor}
          >
            {phase.title}
          </button>
          {isCurrent && (
            <button
              type="button"
              onClick={onToggle}
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

        {/* Description (toggle) */}
        {expanded && (
          <p className="mt-1 rounded-lg bg-white/70 p-3 text-[13px] leading-relaxed text-slate-600">
            {phase.description}
          </p>
        )}
      </div>
    </div>
  )
}

export function App() {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <Theme accentColor="blue" grayColor="slate">
      <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col bg-white">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <HomeIcon width={22} height={22} className="text-amber-700" />
            <span className="text-lg text-slate-900">
              住宅ローン <span className="font-bold">ナビ</span>
            </span>
          </div>
          <Avatar
            radius="full"
            fallback="U"
            color="blue"
            variant="soft"
            size="2"
          />
        </header>

        {/* Timeline */}
        <main className="flex-1 bg-[#cfe0f5] px-4 pb-10 pt-4">
          {PHASES.map((phase, i) => (
            <PhaseRow
              key={phase.id}
              phase={phase}
              isFirst={i === 0}
              isLast={i === PHASES.length - 1}
              expanded={openId === phase.id}
              onToggle={() =>
                setOpenId((prev) => (prev === phase.id ? null : phase.id))
              }
            />
          ))}
        </main>
      </div>
    </Theme>
  )
}

export default App
