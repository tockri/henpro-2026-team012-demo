import { useState } from 'react'
import { Avatar } from '@radix-ui/themes'
import { HomeIcon } from '@radix-ui/react-icons'
import { PHASES } from './phases'
import { PhaseRow } from './PhaseRow'
import { PhaseNote } from './PhaseNote'

export const MainPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null)

  const openPhase = PHASES.find((phase) => phase.id === openId) ?? null

  const doneCount = PHASES.filter((phase) => phase.status === 'done').length
  const currentIndex = PHASES.findIndex((phase) => phase.status === 'current')
  const currentPhase = currentIndex >= 0 ? PHASES[currentIndex] : null
  const progress = Math.round(
    ((doneCount + (currentPhase ? 0.5 : 0)) / PHASES.length) * 100,
  )

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col bg-slate-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 px-5 pb-24 pt-5 text-white">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-10 -top-16 size-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 size-40 rounded-full bg-sky-300/20 blur-2xl" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <HomeIcon width={20} height={20} className="text-white" />
            </div>
            <span className="text-lg tracking-tight">
              住宅ローン <span className="font-bold">ナビ</span>
            </span>
          </div>
          <Avatar
            radius="full"
            fallback="U"
            color="blue"
            variant="solid"
            size="2"
            className="ring-2 ring-white/50"
          />
        </div>

        {/* Progress hero */}
        <div className="relative mt-6">
          <p className="text-sm font-medium text-white/80">現在のステップ</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight">
            {currentPhase ? currentPhase.title : 'お手続き完了'}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-white transition-[width] duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-bold tabular-nums">{progress}%</span>
          </div>
        </div>
      </header>

      {/* Timeline card */}
      <main className="relative z-10 -mt-16 flex-1 px-4 pb-10">
        <div className="rounded-3xl bg-white p-5 shadow-xl shadow-indigo-900/10 ring-1 ring-black/5">
          {PHASES.map((phase, i) => (
            <PhaseRow
              key={phase.id}
              phase={phase}
              index={i}
              isFirst={i === 0}
              isLast={i === PHASES.length - 1}
              onOpenNote={() => setOpenId(phase.id)}
            />
          ))}
        </div>
      </main>

      {/* Description overlay */}
      {openPhase && (
        <PhaseNote phase={openPhase} onClose={() => setOpenId(null)} />
      )}
    </div>
  )
}
