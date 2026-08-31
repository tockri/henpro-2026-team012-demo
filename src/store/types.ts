// 表示中の画面（オーバーレイ）を排他的に表す
export type Screen =
  | { kind: 'main' }
  | { kind: 'chat' }
  | { kind: 'reservation'; initialTopic?: string }
  | { kind: 'fileUpload'; actionLabel: string }
  | { kind: 'loanPortal' }
