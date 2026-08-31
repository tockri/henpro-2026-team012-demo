import { useEffect } from 'react'
import { Avatar } from '@radix-ui/themes'
import { HomeIcon, ChatBubbleIcon, CalendarIcon } from '@radix-ui/react-icons'
import {
  currentPhaseId,
  derivePhases,
  calcProgress,
  calcUnreadCount,
} from './phases'
import { PhaseRow } from './PhaseRow'
import { PhaseNote } from './PhaseNote'
import { FileUploadPage } from './FileUploadPage'
import { ChatPage } from './ChatPage'
import { ReservationPage } from './ReservationPage'
import { LoanPortalPage } from './LoanPortalPage'
import { AdPromo } from './AdPromo'
import { BudgetReview, BUDGET_REVIEW_TOPIC } from './BudgetReview'
import { useAppStore } from './store/appStore'

const DEMO_INTERVAL_MS = 5000

// ?mode=dev のときは開発モード: 自動切り替えを止め、SPACEキーで手動切り替え
const isDevMode =
  new URLSearchParams(window.location.search).get('mode') === 'dev'

export const MainPage: React.FC = () => {
  const demoStep = useAppStore((s) => s.demoStep)
  const advancePhase = useAppStore((s) => s.advancePhase)
  const screen = useAppStore((s) => s.screen)
  const showNote = useAppStore((s) => s.showNote)
  const closeNote = useAppStore((s) => s.closeNote)
  const openNotePhaseId = useAppStore((s) => s.openNotePhaseId)
  const runAction = useAppStore((s) => s.runAction)
  const openChat = useAppStore((s) => s.openChat)
  const openReservation = useAppStore((s) => s.openReservation)
  const backToMain = useAppStore((s) => s.backToMain)
  const uploadedActionNames = useAppStore((s) => s.uploadedActionNames)
  const markUploaded = useAppStore((s) => s.markUploaded)

  // 5秒おきに現在フェーズを巡回させる（別画面表示中・devモードは停止）
  useEffect(() => {
    if (screen.kind !== 'main' || isDevMode) return
    const timer = setInterval(advancePhase, DEMO_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [screen.kind, advancePhase])

  // devモード: SPACEキーで手動フェーズ切り替え
  useEffect(() => {
    if (!isDevMode) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      // 入力欄にフォーカスがあるときは無視
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      e.preventDefault()
      advancePhase()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [advancePhase])

  // --- ここから下はすべて状態からの導出（純粋関数） ---
  const currentId = currentPhaseId(demoStep)
  const phases = derivePhases(currentId)
  const currentIndex = phases.findIndex((p) => p.id === currentId)
  const currentPhase = currentIndex >= 0 ? phases[currentIndex] : null
  const progress = calcProgress(phases)
  const unreadCount = calcUnreadCount(currentId)
  const hasUnread = unreadCount > 0
  const openPhase = phases.find((p) => p.id === openNotePhaseId) ?? null

  return (
    <div className="flex min-h-screen w-full flex-col bg-app">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 px-5 pb-15 pt-5 text-white">
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
            <span className="flex-none text-sm font-bold tabular-nums">
              {currentIndex + 1} / {phases.length}ステップ
            </span>
          </div>
        </div>
      </header>

      {/* Timeline card */}
      <main className="relative z-10 -mt-16 mx-auto w-full max-w-[420px] flex-1 px-4 pb-32">
        {currentPhase?.promo ? (
          <AdPromo onReserve={openReservation} />
        ) : (
          <div className="mb-6 "></div>
        )}

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-indigo-900/10 ring-1 ring-black/5">
          {phases.map((phase, i) => (
            <PhaseRow
              key={phase.id}
              phase={phase}
              index={i}
              isFirst={i === 0}
              isLast={i === phases.length - 1}
              onOpenNote={() => showNote(phase.id)}
              onAction={runAction}
              uploadedActionNames={uploadedActionNames}
            />
          ))}
        </div>

        {/* 家計の見直し（任意導線） */}
        <BudgetReview onReserve={() => openReservation(BUDGET_REVIEW_TOPIC)} />
      </main>

      {/* 来店予約・担当者に連絡（sticky） */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        {/* 来店予約（常時表示） */}
        <button
          type="button"
          onClick={() => openReservation()}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-amber-900/30 transition active:scale-95"
        >
          <CalendarIcon width={20} height={20} />
          来店予約
        </button>

        {/* 担当者に連絡 */}
        <button
          type="button"
          onClick={openChat}
          className="relative flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-amber-900/30 transition active:scale-95"
        >
          <ChatBubbleIcon width={20} height={20} />
          担当者に連絡
          {hasUnread && (
            <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border-2 border-white bg-rose-500 text-xs font-bold tabular-nums text-white shadow">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Description overlay */}
      {openPhase && <PhaseNote phase={openPhase} onClose={closeNote} />}

      {/* 外部ファイル送信サービスへの遷移（デモ） */}
      {screen.kind === 'fileUpload' && (
        <FileUploadPage
          actionLabel={screen.actionLabel}
          onBack={backToMain}
          onUploaded={() => markUploaded(screen.actionLabel)}
        />
      )}

      {/* 外部チャットシステムへの遷移（デモ） */}
      {screen.kind === 'chat' && <ChatPage onBack={backToMain} />}

      {/* 来店予約Webへの遷移（デモ） */}
      {screen.kind === 'reservation' && (
        <ReservationPage
          onBack={backToMain}
          initialTopic={screen.initialTopic}
        />
      )}

      {/* 住宅ローンポータル（仮審査申込）への遷移（デモ） */}
      {screen.kind === 'loanPortal' && <LoanPortalPage onBack={backToMain} />}
    </div>
  )
}
