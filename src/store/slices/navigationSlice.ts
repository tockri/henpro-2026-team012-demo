import type { Screen } from '../types'
import type { SliceCreator } from '../appState'

export type NavigationSlice = {
  screen: Screen
  openChat: () => void
  openReservation: (initialTopic?: string) => void
  openFileUpload: (actionLabel: string) => void
  openLoanPortal: () => void
  openInsuranceCheck: () => void
  backToMain: () => void

  openNotePhaseId: string | null
  showNote: (phaseId: string) => void
  closeNote: () => void
}

export const createNavigationSlice: SliceCreator<NavigationSlice> = (set) => ({
  screen: { kind: 'main' },
  openChat: () => set({ screen: { kind: 'chat' } }, false, 'nav/openChat'),
  openReservation: (initialTopic) =>
    set(
      { screen: { kind: 'reservation', initialTopic } },
      false,
      'nav/openReservation'
    ),
  openFileUpload: (actionLabel) =>
    set(
      { screen: { kind: 'fileUpload', actionLabel } },
      false,
      'nav/openFileUpload'
    ),
  openLoanPortal: () =>
    set({ screen: { kind: 'loanPortal' } }, false, 'nav/openLoanPortal'),
  openInsuranceCheck: () =>
    set(
      { screen: { kind: 'insuranceCheck' } },
      false,
      'nav/openInsuranceCheck'
    ),
  backToMain: () => set({ screen: { kind: 'main' } }, false, 'nav/backToMain'),

  openNotePhaseId: null,
  showNote: (phaseId) =>
    set({ openNotePhaseId: phaseId }, false, 'nav/showNote'),
  closeNote: () => set({ openNotePhaseId: null }, false, 'nav/closeNote'),
})
