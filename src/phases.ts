export type PhaseStatus = 'done' | 'current' | 'todo'

export type Task = {
  id: string
  label: string
  done: boolean
}

// アクション押下時の遷移先。fileUpload は対象書類名を必須で持つ。
export type ActionTarget =
  | { kind: 'reservation' }
  | { kind: 'fileUpload'; actionName: string }
  | { kind: 'loanPortal' }
  | { kind: 'insuranceCheck' }

// アクションボタン。to で押下時の遷移先ページを表す。
export type PhaseAction = {
  label: string
  to: ActionTarget
  goNextDemoStep?: boolean // デモ用: 押下時に demoStep を進めるか
}

// ソースデータの定義（status は持たない。現在フェーズから導出する）
export type PhaseDef = {
  id: string
  title: string
  description: string
  tasks?: Task[]
  actions?: PhaseAction[]
  message?: string
  promo?: boolean
  budgetReview?: boolean
  // この Phase を通過するまで非表示にする（対象 Phase の id）
  revealAfter?: string
}

// 描画に使う Phase（導出した status 付き）
export type Phase = PhaseDef & { status: PhaseStatus }

export const PHASES: PhaseDef[] = [
  {
    id: 'pre-apply',
    title: '仮審査申し込み',
    description: '住宅ローンの仮審査をお申し込みいただく最初のステップです。「住宅ローンポータル」サイトからお申込みいただきます。',
    promo: false,
    budgetReview: true
  },
  {
    id: 'pre-result',
    title: '仮審査結果連絡',
    description: '仮審査の結果をご連絡いたします。',
    promo: false,
    budgetReview: true,
    message:
      'ただいま仮審査中です。\n審査の結果は2026年9月10日までにお知らせいたします。\nしばらくお待ちください。',
  },
  {
    id: 'meeting-reservation',
    title: '来店予約',
    description:
      'ご来店またはWebでの面談を予約し、担当者と今後の手続きについてご相談いただきます。',
    actions: [
      {
        label: 'ご来店Web予約',
        to: { kind: 'reservation' },
        goNextDemoStep: true,
      },
    ],
    promo: true,
  },
  {
    id: 'meeting',
    title: 'ご面談',
    description: '担当者と今後の手続きについてご相談いただきます。',
    message:
      'ご面談は2026年8月20日 15:00に予約済みです。\nご来店お待ちしております。',
    promo: true,    
  },
  {
    id: 'budget-review',
    title: '家計見直し',
    revealAfter: 'meeting',
    description: 'ライフプランアドバイザーからの依頼により、書類アップロードをお願いいたします。',
    actions: [
      {
        label: '生命保険確認サービス',
        to: { kind: 'insuranceCheck' },
      },
      {
        label: 'ご来店Web予約',
        to: { kind: 'reservation' },
        goNextDemoStep: true,
      },
    ]
  },
  {
    id: 'meeting2',
    title: '家計見直しのご面談',
    revealAfter: 'meeting',
    description: 'ライフプランアドバイザーが相談を承ります。',
    message:
      'ご面談は2026年8月25日 12:00に予約済みです。\nご来店お待ちしております。',
  },
  {
    id: 'main-apply',
    title: '本審査申し込み',
    description: '「住宅ローンポータル」で、正式なローン契約に向けた本審査をお申し込みいただきます。',
    actions: [
      {
        label: '住宅ローンポータルへ',
        to: {kind: 'loanPortal'},
        goNextDemoStep: true,
      }
    ]
  },
  {
    id: 'main-result',
    title: '本審査結果連絡',
    description: '本審査の結果をご連絡いたします。',
    message:
      'ただいま団信の申し込み中です。\n本審査の結果は2026年9月10日までにお知らせいたしますのでしばらくお待ちください。',
  },
  {
    id: 'contract',
    title: 'ご契約',
    description: '融資条件をご確認のうえ、ローン契約を締結します。',
  },
  {
    id: 'mortgage',
    title: '抵当権設定',
    description: 'ご購入物件に抵当権を設定する手続きを行います。',
  },
  {
    id: 'execution',
    title: '融資実行',
    description: 'ご指定の口座へ融資金が振り込まれ、お手続きが完了します。',
  },
]

// デモ用: 現在のフェーズがこの順で切り替わる
export const DEMO_SEQUENCE = [
  'pre-result',
  'meeting-reservation',
  'meeting',
  'budget-review',
  'meeting2',
  'main-apply',
  'main-result',
] as const

// --- 純粋関数（保持せず、状態から導出する） ---

/** demoStep から現在の Phase ID を求める */
export const currentPhaseId = (demoStep: number): string =>
  DEMO_SEQUENCE[demoStep % DEMO_SEQUENCE.length] ?? DEMO_SEQUENCE[0]

/** revealAfter で指定された Phase を通過済みかどうか */
const isRevealed = (phase: PhaseDef, currentIndex: number): boolean => {
  if (!phase.revealAfter) return true
  const afterIndex = PHASES.findIndex((p) => p.id === phase.revealAfter)
  return afterIndex >= 0 && currentIndex > afterIndex
}

/** 現在 Phase を起点に、各 Phase の status を導出する（未開放の Phase は除く） */
export const derivePhases = (currentId: string): Phase[] => {
  const currentIndex = PHASES.findIndex((p) => p.id === currentId)
  return PHASES.filter((phase) => isRevealed(phase, currentIndex)).map(
    (phase) => {
      const i = PHASES.indexOf(phase)
      return {
        ...phase,
        status:
          i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'todo',
      }
    },
  )
}

/** 進捗率（0-100）。current は 0.5 ステップとして扱う */
export const calcProgress = (phases: Phase[]): number => {
  const done = phases.filter((p) => p.status === 'done').length
  const hasCurrent = phases.some((p) => p.status === 'current')
  return Math.round(((done + (hasCurrent ? 0.5 : 0)) / phases.length) * 100)
}

/** 未読チャット件数（特定 Phase のときだけ 1 件、というデモ仕様） */
export const calcUnreadCount = (currentId: string): number =>
  currentId === 'pre-result' || currentId === 'meeting2' || currentId === 'main-result' ? 1 : 0
