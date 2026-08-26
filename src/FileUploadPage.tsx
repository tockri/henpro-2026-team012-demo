import { useState } from 'react'
import { Button } from '@radix-ui/themes'
import {
  ArrowLeftIcon,
  LockClosedIcon,
  UploadIcon,
  FileIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons'

export type FileUploadPageProps = {
  /** 提出する書類名（ボタンのラベル）。例: 「マイナンバーを提出」 */
  actionLabel: string
  onBack: () => void
}

const SERVICE_URL = 'secure-file-transfer.example.com'

export const FileUploadPage: React.FC<FileUploadPageProps> = ({
  actionLabel,
  onBack,
}) => {
  const [uploaded, setUploaded] = useState(false)
  const [sent, setSent] = useState(false)

  // 「〜を提出」→「〜」の書類名を取り出す
  const docName = actionLabel.replace(/を提出$/, '')

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 animate-fade-in">
      {/* 疑似ブラウザのアドレスバー */}
      <div className="flex items-center gap-2 bg-slate-200 px-3 py-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="戻る"
          className="flex size-8 flex-none items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-300"
        >
          <ArrowLeftIcon width={18} height={18} />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-slate-500">
          <LockClosedIcon width={13} height={13} className="flex-none text-emerald-600" />
          <span className="truncate text-xs">{SERVICE_URL}</span>
        </div>
      </div>

      {/* サービスのコンテンツ */}
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col px-5 pt-6">
        <div className="flex items-center gap-2 text-slate-800">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <LockClosedIcon width={16} height={16} />
          </div>
          <span className="text-base font-bold tracking-tight">
            セキュアファイル送信
          </span>
        </div>

        <p className="mt-6 text-sm text-slate-500">提出書類</p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">{docName}</h1>

        {sent ? (
          <div className="mt-10 flex flex-col items-center text-center">
            <CheckCircledIcon width={64} height={64} className="text-emerald-500" />
            <p className="mt-4 text-lg font-bold text-slate-900">送信が完了しました</p>
            <p className="mt-1 text-sm text-slate-500">
              {docName}を受け付けました。
            </p>
            <Button
              size="3"
              onClick={onBack}
              className="mt-8 w-full !bg-gradient-to-r !from-blue-600 !to-indigo-600 !font-semibold"
            >
              住宅ローンナビに戻る
            </Button>
          </div>
        ) : (
          <>
            {/* アップロード領域 */}
            <button
              type="button"
              onClick={() => setUploaded(true)}
              className={
                'mt-6 flex w-full flex-col items-center rounded-2xl border-2 border-dashed p-8 transition ' +
                (uploaded
                  ? 'border-emerald-400 bg-emerald-50'
                  : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50')
              }
            >
              {uploaded ? (
                <>
                  <FileIcon width={36} height={36} className="text-emerald-600" />
                  <span className="mt-3 text-sm font-semibold text-slate-800">
                    {docName}.pdf
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    ファイルを選択しました
                  </span>
                </>
              ) : (
                <>
                  <UploadIcon width={36} height={36} className="text-slate-400" />
                  <span className="mt-3 text-sm font-medium text-slate-600">
                    タップしてファイルを選択
                  </span>
                  <span className="mt-1 text-xs text-slate-400">
                    JPEG / PNG / PDF（最大10MB）
                  </span>
                </>
              )}
            </button>

            <Button
              size="3"
              disabled={!uploaded}
              onClick={() => setSent(true)}
              className="mt-6 w-full !bg-gradient-to-r !from-blue-600 !to-indigo-600 !font-semibold shadow-md shadow-blue-500/30 disabled:!opacity-40"
            >
              この内容で送信する
            </Button>

            <p className="mt-3 text-center text-xs text-slate-400">
              通信は暗号化され、安全に送信されます
            </p>
          </>
        )}
      </div>
    </div>
  )
}
