import { useEffect, useState } from 'react'
import { Avatar } from '@radix-ui/themes'
import { HomeIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import { PHASES } from './phases'
import type { Phase } from './phases'
import { PhaseRow } from './PhaseRow'
import { PhaseNote } from './PhaseNote'
import { FileUploadPage } from './FileUploadPage'
import { ChatPage } from './ChatPage'

// デモ用: 現在のフェーズがこの順で自動的に切り替わる
const DEMO_SEQUENCE = ['meeting', 'main-docs', 'main-result'] as const
const DEMO_INTERVAL_MS = 5000

export const MainPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null)
  const [demoStep, setDemoStep] = useState(0)
  const [uploadAction, setUploadAction] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)

  // 5秒おきに現在フェーズを巡回させる（送信画面を開いている間は停止）
  useEffect(() => {
    if (uploadAction) return
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % DEMO_SEQUENCE.length)
    }, DEMO_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [uploadAction])

  const currentId = DEMO_SEQUENCE[demoStep]
  const currentIndex = PHASES.findIndex((phase) => phase.id === currentId)

  // 現在フェーズを起点に、各フェーズの状態を導出する
  const phases: Phase[] = PHASES.map((phase, i) => ({
    ...phase,
    status: i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'todo',
  }))

  // 特定フェーズで未読チャットがある想定（デモ）
  const unreadCount =
    currentId === 'main-docs' || currentId === 'main-result' ? 1 : 0
  const hasUnread = unreadCount > 0

  const openPhase = phases.find((phase) => phase.id === openId) ?? null

  const doneCount = phases.filter((phase) => phase.status === 'done').length
  const currentPhase = currentIndex >= 0 ? phases[currentIndex] : null
  const progress = Math.round(
    ((doneCount + (currentPhase ? 0.5 : 0)) / phases.length) * 100,
  )

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 px-5 pb-24 pt-5 text-white">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-10 -top-16 size-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 left-10 size-40 rounded-full bg-sky-300/20 blur-2xl" />

        <div className="relative mx-auto flex w-full max-w-[420px] items-center justify-between">
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
        <div className="relative mx-auto mt-6 w-full max-w-[420px]">
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
      <main className="relative z-10 -mt-16 mx-auto w-full max-w-[420px] flex-1 px-4 pb-10">
        <div className="rounded-3xl bg-white p-5 shadow-xl shadow-indigo-900/10 ring-1 ring-black/5">
          {phases.map((phase, i) => (
            <PhaseRow
              key={phase.id}
              phase={phase}
              index={i}
              isFirst={i === 0}
              isLast={i === phases.length - 1}
              onOpenNote={() => setOpenId(phase.id)}
              onAction={(label) => setUploadAction(label)}
            />
          ))}
        </div>
      </main>

      {/* 担当者に連絡（sticky） */}
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-900/30 transition active:scale-95"
      >
        <ChatBubbleIcon width={20} height={20} />
        担当者に連絡
        {hasUnread && (
          <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border-2 border-white bg-rose-500 text-xs font-bold tabular-nums text-white shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Description overlay */}
      {openPhase && (
        <PhaseNote phase={openPhase} onClose={() => setOpenId(null)} />
      )}

      {/* 外部ファイル送信サービスへの遷移（デモ） */}
      {uploadAction && (
        <FileUploadPage
          actionLabel={uploadAction}
          onBack={() => setUploadAction(null)}
        />
      )}

      {/* 外部チャットシステムへの遷移（デモ） */}
      {chatOpen && <ChatPage onBack={() => setChatOpen(false)} />}
    </div>
  )
}
