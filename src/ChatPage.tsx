import { useState } from 'react'
import { AGENT, agentFullName } from './agent'
import {
  ArrowLeftIcon,
  LockClosedIcon,
  PaperPlaneIcon,
} from '@radix-ui/react-icons'

export type ChatPageProps = {
  onBack: () => void
}

type ChatMessage = {
  id: number
  from: 'agent' | 'me'
  text: string
}

const SERVICE_URL = 'chat.loan-support.example.com'

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    from: 'agent',
    text: `お問い合わせありがとうございます。住宅ローン担当の${agentFullName(AGENT)}です。ご質問をどうぞ。`,
  },
]

export const ChatPage: React.FC<ChatPageProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')

  const send = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, from: 'me', text },
    ])
    // 担当者の自動返信（デモ）
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          from: 'agent',
          text: 'ご連絡ありがとうございます。内容を確認のうえ、担当者より折り返しご案内いたします。',
        },
      ])
    }, 800)
  }

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

      {/* チャットヘッダー */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-white">
        <div className="flex size-10 flex-none items-center justify-center rounded-full bg-white/20 font-bold backdrop-blur">
          {AGENT.initial}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold leading-tight">
            担当：{agentFullName(AGENT)}
          </p>
          <p className="flex items-center gap-1 text-xs text-white/80">
            <span className="inline-block size-2 rounded-full bg-emerald-300" />
            住宅ローン サポート・オンライン
          </p>
        </div>
      </div>

      {/* メッセージ一覧 */}
      <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              'flex ' + (msg.from === 'me' ? 'justify-end' : 'justify-start')
            }
          >
            <div
              className={
                'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ' +
                (msg.from === 'me'
                  ? 'rounded-br-md bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                  : 'rounded-bl-md bg-white text-slate-700')
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* 入力欄 */}
      <div className="mx-auto flex w-full max-w-[420px] items-center gap-2 border-t border-slate-200 bg-white px-3 py-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') send()
          }}
          placeholder="メッセージを入力"
          className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="button"
          onClick={send}
          aria-label="送信"
          className="flex size-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 transition active:scale-95"
        >
          <PaperPlaneIcon width={18} height={18} />
        </button>
      </div>
    </div>
  )
}
