import type { ActionTarget, PhaseAction } from '../../phases'
import type { Screen } from '../types'
import type { SliceCreator } from '../appState'

// アクションの遷移先（ActionTarget）を、表示する画面（Screen）に対応づける
const screenFor = (to: ActionTarget): Screen => {
  switch (to.kind) {
    case 'reservation':
      return { kind: 'reservation' }
    case 'fileUpload':
      return { kind: 'fileUpload', actionLabel: to.actionName }
    case 'loanPortal':
      return { kind: 'loanPortal' }
  }
}

// 複数のスライスにまたがる複合アクションを置くスライス。
// 「1回のユーザー操作で navigation と phase の状態が連動して変わる」ものは、
// どちらか片方のスライスに押し込めず、ここに集約する。
export type CompositeSlice = {
  // アクションの to に従って画面遷移しつつ、必要ならデモを1歩進める
  runAction: (action: PhaseAction) => void
}

// set/get の型引数が AppState 全体なので、
// get() から他スライスのアクション（advancePhase）を型付きで呼べる。
export const createCompositeSlice: SliceCreator<CompositeSlice> = (
  set,
  get
) => ({
  runAction: (action) => {
    // navigationSlice の担当：画面遷移
    set({ screen: screenFor(action.to) }, false, 'composite/runAction')

    // phaseSlice の担当：デモ進行。ロジックを重複させず既存アクションを再利用する
    if (action.goNextDemoStep) {
      get().advancePhase()
    }
  },
})
