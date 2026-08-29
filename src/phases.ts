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

// アクションボタン。to で押下時の遷移先ページを表す。
export type PhaseAction = {
  label: string
  to: ActionTarget
}

// ソースデータの定義（status は持たない。現在フェーズから導出する）
export type PhaseDef = {
  id: string
  title: string
  description: string
  tasks?: Task[]
  actions?: PhaseAction[]
  message?: string
}

// 描画に使う Phase（導出した status 付き）
export type Phase = PhaseDef & { status: PhaseStatus }

export const PHASES: PhaseDef[] = [
  {
    id: 'pre-apply',
    title: '仮審査申し込み',
    description: '住宅ローンの仮審査をお申し込みいただく最初のステップです。',
  },
  {
    id: 'pre-docs',
    title: '必要書類の準備',
    description:
      '本人確認書類や収入証明書など、仮審査に必要な書類をご準備いただきます。',
  },
  {
    id: 'pre-review',
    title: '仮審査',
    description: '銀行がご提出内容をもとに仮審査を行います。',
  },
  {
    id: 'pre-result',
    title: '仮審査結果連絡',
    description: '仮審査の結果をご連絡いたします。',
  },
  {
    id: 'meeting-reservation',
    title: '来店予約',
    description:
      'ご来店またはWebでの面談を予約し、担当者と今後の手続きについてご相談いただきます。',
    actions: [{ label: 'ご来店Web予約', to: { kind: 'reservation' } }],
  },
  {
    id: 'meeting',
    title: 'ご面談',
    description: '担当者と今後の手続きについてご相談いただきます。',
    tasks: [{ id: 'meeting-date', label: '2026年8月20日 ご面談', done: false }],
  },
  {
    id: 'main-apply',
    title: '本審査申し込み',
    description: '正式なローン契約に向けた本審査をお申し込みいただきます。',
  },
  {
    id: 'main-docs',
    title: '必要書類の準備',
    description: '本審査に必要な書類をご準備いただきます。',
    actions: [
      { label: '運転免許証を提出', to: { kind: 'fileUpload', actionName: '運転免許証' } },
      { label: '所得証明書を提出', to: { kind: 'fileUpload', actionName: '所得証明書' } },
      { label: '住民票を提出', to: { kind: 'fileUpload', actionName: '住民票' } },
    ],
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
  'meeting-reservation',
  'meeting',
  'main-docs',
  'main-result',
] as const

// --- 純粋関数（保持せず、状態から導出する） ---

/** demoStep から現在の Phase ID を求める */
export const currentPhaseId = (demoStep: number): string =>
  DEMO_SEQUENCE[demoStep % DEMO_SEQUENCE.length] ?? DEMO_SEQUENCE[0]

/** 現在 Phase を起点に、各 Phase の status を導出する */
export const derivePhases = (currentId: string): Phase[] => {
  const currentIndex = PHASES.findIndex((p) => p.id === currentId)
  return PHASES.map((phase, i) => ({
    ...phase,
    status: i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'todo',
  }))
}

/** 進捗率（0-100）。current は 0.5 ステップとして扱う */
export const calcProgress = (phases: Phase[]): number => {
  const done = phases.filter((p) => p.status === 'done').length
  const hasCurrent = phases.some((p) => p.status === 'current')
  return Math.round(((done + (hasCurrent ? 0.5 : 0)) / phases.length) * 100)
}

/** 未読チャット件数（特定 Phase のときだけ 1 件、というデモ仕様） */
export const calcUnreadCount = (currentId: string): number =>
  currentId === 'main-docs' || currentId === 'main-result' ? 1 : 0
