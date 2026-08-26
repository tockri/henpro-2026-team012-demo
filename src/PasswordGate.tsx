import { useState } from 'react'
import { Button } from '@radix-ui/themes'
import { LockClosedIcon } from '@radix-ui/react-icons'

// 「henpro」の SHA-256 ハッシュ。平文はソースに含めない。
// 注意: フロントだけの簡易ゲートのため、開発者ツールから突破は可能。
// 「関係者以外にうっかり見られない」程度の抑止用。
const PASSWORD_HASH =
  '600e47c44bb160af814189529167bd64bfaafb7fc0d4b6f67340af3f7f26b0cd'
const STORAGE_KEY = 'henpro-demo-auth'

const sha256Hex = async (text: string): Promise<string> => {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text),
  )
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const readAuthed = (): boolean => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === PASSWORD_HASH
  } catch {
    return false
  }
}

export type PasswordGateProps = {
  children: React.ReactNode
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const [authed, setAuthed] = useState(readAuthed)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  if (authed) {
    return <>{children}</>
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const hash = await sha256Hex(input)
    if (hash === PASSWORD_HASH) {
      try {
        sessionStorage.setItem(STORAGE_KEY, hash)
      } catch {
        // sessionStorage が使えない環境でもそのまま通す
      }
      setAuthed(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-[360px] rounded-3xl bg-white p-7 shadow-2xl"
      >
        <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <LockClosedIcon width={24} height={24} />
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
          住宅ローンナビ（デモ）
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          閲覧にはパスワードが必要です。
        </p>

        <input
          type="password"
          value={input}
          autoFocus
          onChange={(e) => {
            setInput(e.target.value)
            setError(false)
          }}
          placeholder="パスワード"
          className="mt-5 w-full rounded-xl bg-slate-100 px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400"
        />
        {error && (
          <p className="mt-2 text-sm text-rose-500">
            パスワードが正しくありません。
          </p>
        )}

        <Button
          type="submit"
          size="3"
          mt="5"
          className="w-full !bg-gradient-to-r !from-blue-600 !to-indigo-600 !font-semibold shadow-md shadow-blue-500/30"
        >
          閲覧する
        </Button>
      </form>
    </div>
  )
}
