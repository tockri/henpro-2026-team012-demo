import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AppState } from './appState'
import { createPhaseSlice } from './slices/phaseSlice'
import { createNavigationSlice } from './slices/navigationSlice'
import { createUploadSlice } from './slices/uploadSlice'
import { createCompositeSlice } from './slices/compositeSlice'

export type { AppState } from './appState'

// 各スライスを1つのストアに合成する。
// スライスは同じ set/get を共有するので、スプレッドで並べるだけでよい。
export const useAppStore = create<AppState>()(
  devtools(
    (...a) => ({
      ...createPhaseSlice(...a),
      ...createNavigationSlice(...a),
      ...createUploadSlice(...a),
      ...createCompositeSlice(...a),
    }),
    // 開発時だけ Redux DevTools に接続する。
    { name: 'appStore', enabled: process.env.NODE_ENV !== 'production' }
  )
)
