import { DEMO_SEQUENCE } from '../../phases'
import type { SliceCreator } from '../appState'

export type PhaseSlice = {
  demoStep: number
  advancePhase: () => void
  setDemoStep: (step: number) => void
}

export const createPhaseSlice: SliceCreator<PhaseSlice> = (set) => ({
  demoStep: 0,
  advancePhase: () =>
    set(
      (s) => ({ demoStep: (s.demoStep + 1) % DEMO_SEQUENCE.length }),
      false,
      'phase/advancePhase'
    ),
  setDemoStep: (step) => set({ demoStep: step }, false, 'phase/setDemoStep'),
})
