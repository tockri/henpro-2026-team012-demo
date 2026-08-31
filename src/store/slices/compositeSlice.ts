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
    case 'insuranceCheck':
      return { kind: 'insuranceCheck' }
  }
}

// 複数のスライスにまたがる複合アクションを置くスライス。
// 「1回のユーザー操作で navigation と phase の状態が連動して変わる」ものは、
// どちらか片方のスライスに押し込めず、ここに集約する。
export type CompositeSlice = {
  // アクションの to に従って画面遷移しつつ、必要ならデモを1歩進める
  runAction: (action: PhaseAction) => void
  // デモを1歩進める。一巡して最初に戻ったら提出済み・確認済みの状態も初期化する
  advanceDemo: () => void
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
      get().advanceDemo()
    }
  },

  advanceDemo: () => {
    get().advancePhase()
    // demoStep が 0 に戻った ＝ デモが一巡したので、提出済み・確認済みを初期化する
    if (get().demoStep === 0) {
      get().clearUploaded()
    }
  },
})
