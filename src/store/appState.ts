import type { StateCreator } from 'zustand'
import type { PhaseSlice } from './slices/phaseSlice'
import type { NavigationSlice } from './slices/navigationSlice'
import type { UploadSlice } from './slices/uploadSlice'
import type { CompositeSlice } from './slices/compositeSlice'

// 全スライスを合成したストア全体の型
export type AppState = PhaseSlice & NavigationSlice & UploadSlice & CompositeSlice

// 各スライスを書くための StateCreator ヘルパー。
// - 第2型引数 [['zustand/devtools', never]] で devtools ミドルウェア適用下の
//   set/get の型を正しくする
// - 第4型引数 T が「このスライスが提供する部分」
// AppState 全体を第1型引数に渡しているので、スライス内の get() から
// 他スライスの状態にも型付きでアクセスできる（＝複合アクションが書ける）
export type SliceCreator<T> = StateCreator<
  AppState,
  [['zustand/devtools', never]],
  [],
  T
>
