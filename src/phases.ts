export type PhaseStatus = 'done' | 'current' | 'todo'

export type Task = {
  id: string
  label: string
  done: boolean
}

export type Phase = {
  id: string
  title: string
  status: PhaseStatus
  description: string
  tasks?: Task[]
  actions?: { label: string }[]
  message?: string
}

export const PHASES: Phase[] = [
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
    description:
      '本人確認書類や収入証明書など、仮審査に必要な書類をご準備いただきます。',
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
    id: 'meeting-reservation',
    title: '来店予約',
    status: 'current',
    description:
      'ご来店またはWebでの面談を予約し、担当者と今後の手続きについてご相談いただきます。',
    actions: [{ label: 'ご来店Web予約' }],
  },
  {
    id: 'meeting',
    title: 'ご面談',
    status: 'todo',
    description: '担当者と今後の手続きについてご相談いただきます。',
    tasks: [{ id: 'meeting-date', label: '2026年8月20日 ご面談', done: false }],
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
    actions: [
      { label: 'マイナンバーを提出' },
      { label: '住民票を提出' },
      { label: '保険証券を提出' },
    ],
  },
  {
    id: 'main-result',
    title: '本審査結果連絡',
    status: 'todo',
    description: '本審査の結果をご連絡いたします。',
    message:
      'ただいま団信の申し込み中です。\n本審査の結果は2026年9月10日までにお知らせいたしますのでしばらくお待ちください。',
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
