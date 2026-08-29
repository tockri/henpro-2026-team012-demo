import type { SliceCreator } from '../appState'

export type UploadSlice = {
  // アップロード済みの書類名（actionName）
  uploadedActionNames: string[]
  markUploaded: (actionName: string) => void
}

export const createUploadSlice: SliceCreator<UploadSlice> = (set) => ({
  uploadedActionNames: [],
  markUploaded: (actionName) =>
    set(
      (s) =>
        s.uploadedActionNames.includes(actionName)
          ? s
          : { uploadedActionNames: [...s.uploadedActionNames, actionName] },
      false,
      'upload/markUploaded'
    ),
})
