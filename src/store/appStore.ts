import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { DEMO_SEQUENCE } from '../phases'
import type { PhaseAction } from '../phases'
import type { Screen } from './types'

type PhaseSlice = {
  demoStep: number
  advancePhase: () => void
  setDemoStep: (step: number) => void
}

type NavigationSlice = {
  screen: Screen
  openChat: () => void
  openReservation: () => void
  openFileUpload: (actionLabel: string) => void
  backToMain: () => void
  // アクションの to に従って遷移先を決める
  runAction: (action: PhaseAction) => void

  openNotePhaseId: string | null
  showNote: (phaseId: string) => void
  closeNote: () => void
}

type UploadSlice = {
  // アップロード済みの書類名（actionName）
  uploadedActionNames: string[]
  markUploaded: (actionName: string) => void
}

export type AppState = PhaseSlice & NavigationSlice & UploadSlice

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    // --- phaseSlice ---
    demoStep: 0,
    advancePhase: () =>
      set((s) => ({ demoStep: (s.demoStep + 1) % DEMO_SEQUENCE.length })),
    setDemoStep: (step) => set({ demoStep: step }),

    // --- navigationSlice ---
    screen: { kind: 'main' },
    openChat: () => set({ screen: { kind: 'chat' } }),
    openReservation: () => set({ screen: { kind: 'reservation' } }),
    openFileUpload: (actionLabel) =>
      set({ screen: { kind: 'fileUpload', actionLabel } }),
    backToMain: () => set({ screen: { kind: 'main' } }),
    runAction: (action) =>
      set({
        screen:
          action.to.kind === 'reservation'
            ? { kind: 'reservation' }
            : { kind: 'fileUpload', actionLabel: action.to.actionName },
      }),

    openNotePhaseId: null,
    showNote: (phaseId) => set({ openNotePhaseId: phaseId }),
    closeNote: () => set({ openNotePhaseId: null }),

    // --- uploadSlice ---
    uploadedActionNames: [],
    markUploaded: (actionName) =>
      set((s) =>
        s.uploadedActionNames.includes(actionName)
          ? s
          : { uploadedActionNames: [...s.uploadedActionNames, actionName] },
      ),
  })),
)
