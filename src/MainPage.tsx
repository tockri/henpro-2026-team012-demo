import { useState } from 'react'
import { Avatar } from '@radix-ui/themes'
import { HomeIcon } from '@radix-ui/react-icons'
import { PHASES } from './phases'
import { PhaseRow } from './PhaseRow'
import { PhaseNote } from './PhaseNote'

export const MainPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null)

  const openPhase = PHASES.find((phase) => phase.id === openId) ?? null

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <HomeIcon width={22} height={22} className="text-amber-700" />
          <span className="text-lg text-slate-900">
            住宅ローン <span className="font-bold">ナビ</span>
          </span>
        </div>
        <Avatar radius="full" fallback="U" color="blue" variant="soft" size="2" />
      </header>

      {/* Timeline */}
      <main className="flex-1 bg-[#cfe0f5] px-4 pb-10 pt-4">
        {PHASES.map((phase, i) => (
          <PhaseRow
            key={phase.id}
            phase={phase}
            isFirst={i === 0}
            isLast={i === PHASES.length - 1}
            onOpenNote={() => setOpenId(phase.id)}
          />
        ))}
      </main>

      {/* Description overlay */}
      {openPhase && (
        <PhaseNote phase={openPhase} onClose={() => setOpenId(null)} />
      )}
    </div>
  )
}
