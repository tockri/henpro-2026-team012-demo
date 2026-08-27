import { useState } from 'react'
import {
  ArrowLeftIcon,
  LockClosedIcon,
  CheckIcon,
  CalendarIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons'

export type ReservationPageProps = {
  onBack: () => void
}

const SERVICE_URL = 'reserve.bank-lifeplan.example.jp'

const STORE = '福岡ライフプランセンター（本店営業部２階）'
const PURPOSE = 'ローンの相談（福岡ライフプランセンター）'

const TOPICS = [
  '【住宅ローン】新規お借入',
  '【住宅ローン】金利変更',
  '【住宅ローン】一部・全額繰上返済',
  '【その他ローン】新規お借入',
  '【その他ローン】一部・全額繰上返済',
  'ローンに関するその他のご相談',
  '支出の見直しに関するご相談',
  '積立（貯蓄・資産運用）に関するご相談',
]

type Day = {
  label: string
  tone: 'sat' | 'sun' | 'weekday'
  closed: boolean // 休業日（斜線）
}

const DAYS: Day[] = [
  { label: '8/29(土)', tone: 'sat', closed: true },
  { label: '8/30(日)', tone: 'sun', closed: true },
  { label: '8/31(月)', tone: 'weekday', closed: false },
  { label: '9/1(火)', tone: 'weekday', closed: false },
  { label: '9/2(水)', tone: 'weekday', closed: false },
  { label: '9/3(木)', tone: 'weekday', closed: false },
  { label: '9/4(金)', tone: 'weekday', closed: false },
]

const TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
]

// 受付中（◯）のスロット
const OPEN_SLOTS: Record<string, string[]> = {
  '9/3(木)': ['15:00', '15:30', '16:00'],
  '9/4(金)': ['13:30', '14:00', '14:30', '15:00'],
}

const dayTextColor = (tone: Day['tone']): string =>
  tone === 'sat' ? 'text-sky-500' : tone === 'sun' ? 'text-rose-500' : 'text-slate-700'

// セクション見出し（水色の下線付き）
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mt-6 border-b-2 border-sky-400 pb-1.5 text-base font-bold text-slate-800">
    {children}
  </h2>
)

export const ReservationPage: React.FC<ReservationPageProps> = ({ onBack }) => {
  const [topic, setTopic] = useState<string | null>(null)
  const [completed, setCompleted] = useState<{ day: string; time: string } | null>(
    null,
  )

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-100 animate-fade-in">
      {/* 疑似ブラウザのアドレスバー */}
      <div className="flex flex-none items-center gap-2 bg-slate-200 px-3 py-2">
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

      {/* コンテンツ */}
      <div className="flex-1 overflow-y-auto">
        {completed ? (
          <CompleteView
            topic={topic ?? ''}
            day={completed.day}
            time={completed.time}
            onBack={onBack}
          />
        ) : (
          <div className="mx-auto w-full max-w-[520px] p-4">
            <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <p className="text-sm text-slate-600">以下の項目をご選択ください。</p>

              {/* 店舗（選択済み） */}
              <SectionTitle>店舗を選択</SectionTitle>
              <SelectedRow text={STORE} />

              {/* 目的（選択済み） */}
              <SectionTitle>ご来店の目的を選択</SectionTitle>
              <SelectedRow text={PURPOSE} />

              {/* ご相談内容 */}
              <SectionTitle>ご相談内容を選択</SectionTitle>
              <p className="border-b border-slate-100 bg-sky-50 px-2 py-2.5 text-sm text-slate-600">
                ※お取引内容を選択してください（予約可能日時が表示されます）
              </p>
              {TOPICS.map((t) => {
                const selected = topic === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={
                      'flex w-full items-center gap-2 border-b border-slate-100 px-2 py-2.5 text-left text-sm transition ' +
                      (selected
                        ? 'bg-sky-50 font-medium text-sky-700'
                        : 'text-slate-700 hover:bg-slate-50')
                    }
                  >
                    <CheckIcon
                      width={16}
                      height={16}
                      className={selected ? 'text-sky-500' : 'text-slate-300'}
                    />
                    {t}
                  </button>
                )
              })}

              {/* 予約日時（相談内容を選ぶと表示） */}
              {topic && (
                <div className="animate-fade-in">
                  <SectionTitle>予約日時を選択</SectionTitle>
                  <Calendar
                    onPick={(day, time) => setCompleted({ day, time })}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const SelectedRow: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center gap-2 bg-sky-50 px-2 py-2.5 text-sm text-slate-700">
    <CheckIcon width={16} height={16} className="flex-none text-sky-500" />
    {text}
  </div>
)

const Calendar: React.FC<{
  onPick: (day: string, time: string) => void
}> = ({ onPick }) => {
  return (
    <>
      {/* 操作バー */}
      <div className="mt-2 flex items-center gap-2 py-2">
        <span className="rounded border border-slate-300 px-2.5 py-1 text-xs text-slate-600">
          直近の状況
        </span>
        <span className="flex size-7 items-center justify-center rounded border border-slate-300 text-slate-500">
          <CalendarIcon width={14} height={14} />
        </span>
        <span className="ml-auto flex gap-1">
          <span className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-300">
            « 前月
          </span>
          <span className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-300">
            ‹ 前週
          </span>
          <span className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600">
            翌週 ›
          </span>
          <span className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600">
            翌月 »
          </span>
        </span>
      </div>

      {/* カレンダー本体（横スクロール可） */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center text-xs">
          <thead>
            <tr>
              <th className="w-14 border border-slate-200 bg-white p-1" />
              {DAYS.map((d) => (
                <th
                  key={d.label}
                  className={
                    'min-w-14 border border-slate-200 bg-white p-2 font-semibold ' +
                    dayTextColor(d.tone)
                  }
                >
                  {d.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIMES.map((time) => (
              <tr key={time}>
                <td className="border border-slate-200 bg-white p-1.5 text-slate-600">
                  {time}
                </td>
                {DAYS.map((d) => {
                  if (d.closed || time === '16:30') {
                    return (
                      <td
                        key={d.label}
                        className="border border-slate-200 bg-[repeating-linear-gradient(45deg,#f1f5f9_0,#f1f5f9_4px,#fff_4px,#fff_8px)] p-1.5"
                      />
                    )
                  }
                  const open = OPEN_SLOTS[d.label]?.includes(time)
                  if (open) {
                    return (
                      <td key={d.label} className="border border-slate-200 bg-white p-0">
                        <button
                          type="button"
                          onClick={() => onPick(d.label, time)}
                          aria-label={`${d.label} ${time} を予約`}
                          className="flex h-8 w-full items-center justify-center text-base font-bold text-blue-500 transition hover:bg-sky-100"
                        >
                          ◯
                        </button>
                      </td>
                    )
                  }
                  return (
                    <td
                      key={d.label}
                      className="border border-slate-200 bg-slate-50 p-1.5 text-slate-400"
                    >
                      ×
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 凡例 */}
      <div className="mt-3 flex gap-4 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <span className="font-bold text-blue-500">◯</span> 受付中
        </span>
        <span className="flex items-center gap-1">
          <span className="text-slate-400">×</span> 受付終了
        </span>
      </div>
    </>
  )
}

const CompleteView: React.FC<{
  topic: string
  day: string
  time: string
  onBack: () => void
}> = ({ topic, day, time, onBack }) => (
  <div className="mx-auto flex w-full max-w-[420px] flex-col items-center px-6 py-12 text-center">
    <CheckCircledIcon width={72} height={72} className="text-emerald-500" />
    <h1 className="mt-5 text-xl font-bold text-slate-900">ご予約が完了しました</h1>
    <p className="mt-2 text-sm text-slate-500">
      ご登録のメールアドレスに予約の確認メールをお送りしました。
    </p>

    <dl className="mt-7 w-full space-y-3 rounded-2xl bg-slate-50 p-5 text-left text-sm ring-1 ring-slate-200">
      <div>
        <dt className="text-xs text-slate-400">店舗</dt>
        <dd className="font-medium text-slate-800">{STORE}</dd>
      </div>
      <div>
        <dt className="text-xs text-slate-400">ご相談内容</dt>
        <dd className="font-medium text-slate-800">{topic}</dd>
      </div>
      <div>
        <dt className="text-xs text-slate-400">ご予約日時</dt>
        <dd className="font-bold text-blue-600">
          2026年 {day} {time}
        </dd>
      </div>
    </dl>

    <button
      type="button"
      onClick={onBack}
      className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white shadow-md shadow-blue-500/30 transition active:scale-95"
    >
      住宅ローンナビに戻る
    </button>
  </div>
)
