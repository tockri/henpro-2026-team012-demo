import { useState } from 'react'
import {
  ArrowLeftIcon,
  LockClosedIcon,
  IdCardIcon,
  HomeIcon,
  PersonIcon,
  DashboardIcon,
  FileTextIcon,
  QuestionMarkCircledIcon,
  CheckIcon,
} from '@radix-ui/react-icons'

// 銀行の「住宅ローンポータル」（仮審査申込フォーム）を模した外部サイト画面。
// 住宅ローンナビ（indigo基調）とは別サービスであることが伝わるよう、
// ポータル側は既存の銀行サイトらしい濃紺ブルー＋緑アクセントで構成する。

export type LoanPortalPageProps = {
  onBack: () => void
}

const SERVICE_URL = 'loan-portal.example-bank.co.jp'

// ヘッダーのステップアイコン（現在は1つ目「お借入内容」）
const STEPS = [
  { label: 'お借入内容', Icon: IdCardIcon },
  { label: '物件情報', Icon: HomeIcon },
  { label: 'お客さま情報', Icon: PersonIcon },
  { label: 'お勤め先', Icon: DashboardIcon },
  { label: '入力内容の確認', Icon: FileTextIcon },
]

const CURRENT_STEP = 0

// 必要資金の内訳。合計（必要資金総額）はこの5項目の和。
const FUND_FIELDS = [
  '土地価格',
  '建物価格',
  'リフォーム・設計変更費',
  '付帯工事費',
  '諸費用',
] as const

type FundKey = (typeof FUND_FIELDS)[number]

type FundState = Record<FundKey, string>

const EMPTY_FUNDS: FundState = {
  土地価格: '',
  建物価格: '',
  'リフォーム・設計変更費': '',
  付帯工事費: '',
  諸費用: '',
}

/** 入力文字列を万円の数値として読む（未入力・不正値は 0） */
const toAmount = (value: string): number => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : 0
}

export const LoanPortalPage: React.FC<LoanPortalPageProps> = ({ onBack }) => {
  const [funds, setFunds] = useState<FundState>(EMPTY_FUNDS)
  const [ownFunds, setOwnFunds] = useState('')
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [term, setTerm] = useState('')
  const [bonus, setBonus] = useState(false)

  // --- 入力からの導出（保持しない） ---
  const total = FUND_FIELDS.reduce((sum, key) => sum + toAmount(funds[key]), 0)
  const borrowing = Math.max(total - toAmount(ownFunds), 0)

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
          <LockClosedIcon
            width={13}
            height={13}
            className="flex-none text-emerald-600"
          />
          <span className="truncate text-xs">{SERVICE_URL}</span>
        </div>
      </div>

      {/* ポータルのコンテンツ */}
      <div className="flex-1 overflow-y-auto bg-white">
        <StepHeader />

        <div className="mx-auto w-full max-w-[420px] px-5">

          {/* セクション見出し */}
          <div className="mt-8 flex items-center gap-3 text-[#1b5ea8]">
            <IdCardIcon width={26} height={26} />
            <h1 className="text-xl tracking-wide">お借入内容</h1>
          </div>

          {/* 小見出し（タブ風のチップ＋横罫） */}
          <div className="mt-5 flex items-stretch">
            <span className="flex-none border border-[#1b5ea8] px-5 py-3 text-[15px] text-[#1b5ea8]">
              必要資金の算定
            </span>
            <span className="min-w-0 flex-1 self-center border-t border-[#1b5ea8]" />
          </div>

          {/* お借入希望日 */}
          <p className="mt-7 text-sm text-slate-500">お借入希望日</p>
          <div className="mt-3 space-y-3">
            <FieldRow
              label="西暦"
              unit="年"
              value={year}
              onChange={setYear}
              placeholder="西暦"
            />
            <FieldRow label="月" unit="月" value={month} onChange={setMonth} />
            <FieldRow label="日" unit="日" value={day} onChange={setDay} />
          </div>

          {/* 必要資金の内訳 */}
          <div className="mt-6 space-y-3">
            {FUND_FIELDS.map((key) => (
              <FieldRow
                key={key}
                label={key}
                unit="万円"
                value={funds[key]}
                onChange={(v) => setFunds((prev) => ({ ...prev, [key]: v }))}
                placeholder={key}
                help
              />
            ))}
          </div>

          {/* 合計（必要資金総額）：自動計算 */}
          <ArrowDivider />
          <div className="text-center">
            <p className="text-sm text-slate-500">合計（必要資金総額）</p>
            <p className="mt-2">
              <span className="text-3xl font-bold tabular-nums text-[#1b5ea8]">
                {total.toLocaleString()}
              </span>
              <span className="ml-1.5 text-lg text-slate-500">万円</span>
            </p>
            <p className="mt-2 text-xs text-slate-400">※自動計算されます。</p>
          </div>
          <ArrowDivider />

          {/* 自己資金 */}
          <div className="mt-6">
            <FieldRow
              label="自己資金"
              unit="万円"
              value={ownFunds}
              onChange={setOwnFunds}
              placeholder="自己資金"
              help
            />
          </div>

          {/* 借入希望金額：必要資金総額 - 自己資金 */}
          <div className="relative mt-8 bg-[#1b5ea8] px-5 pb-7 pt-8 text-center text-white">
            {/* 上辺中央の切り欠き（自己資金からの流れを示す） */}
            <span className="absolute -top-px left-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
            <p className="text-[15px]">借入希望金額</p>
            <p className="mt-2">
              <span className="text-3xl font-bold tabular-nums">
                {borrowing.toLocaleString()}
              </span>
              <span className="ml-1.5 text-lg">万円</span>
            </p>
            <p className="mt-3 text-[13px] font-bold leading-relaxed">
              ※必要資金総額から自己資金を差し引いた金額が自動計算されます。
            </p>
          </div>

          {/* ボーナス返済 */}
          <div className="mt-8 border-t border-slate-200 pt-8">
            <label className="flex cursor-pointer items-center gap-4">
              <input
                type="checkbox"
                checked={bonus}
                onChange={(e) => setBonus(e.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="flex size-7 flex-none items-center justify-center rounded border border-slate-300 bg-white text-transparent transition peer-checked:border-[#1b5ea8] peer-checked:bg-[#1b5ea8] peer-checked:text-white"
              >
                <CheckIcon width={20} height={20} />
              </span>
              <span className="text-[15px] tracking-wide text-slate-700">
                ボーナス返済を希望する
              </span>
            </label>
            <p className="mt-5 text-sm leading-relaxed text-slate-500">
              ※ボーナス返済の有無はローン契約時に決定いただきますので、現時点でのご希望をご入力ください。
            </p>
          </div>

          {/* お借入期間 */}
          <div className="mt-6">
            <FieldRow
              label="お借入期間"
              unit="年"
              value={term}
              onChange={setTerm}
              placeholder="お借入期間"
            />
          </div>
        </div>

        {/* フッター：一時保存とローンセンターへの導線 */}
        <div className="mt-10 bg-[#f7f7f7] px-5 pb-12 pt-10">
          <div className="mx-auto w-full max-w-[420px]">
            <button
              type="button"
              onClick={onBack}
              className="mx-auto block w-full max-w-[300px] rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 py-4 text-center text-[15px] font-bold text-white shadow-md transition active:scale-95"
            >
              一時保存する
            </button>

            <OperatorSupport />
          </div>
        </div>
      </div>
    </div>
  )
}

// --- 部品 ---

type FieldRowProps = {
  label: string
  unit: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** 右側にヘルプ（?）アイコンを出すか */
  help?: boolean
}

// グレー塗りの入力欄。単位は右端に固定表示し、必要なら右外にヘルプアイコンを添える。
const FieldRow: React.FC<FieldRowProps> = ({
  label,
  unit,
  value,
  onChange,
  placeholder,
  help,
}) => (
  <div className="flex items-center gap-3">
    <div className="flex min-w-0 flex-1 items-center rounded-md border border-slate-200 bg-slate-50 px-4">
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 bg-transparent py-4 text-[15px] text-slate-700 outline-none placeholder:text-slate-400"
      />
      <span className="flex-none pl-2 text-[15px] text-slate-400">{unit}</span>
    </div>
    {help && (
      <QuestionMarkCircledIcon
        width={30}
        height={30}
        aria-label={`${label}について`}
        className="flex-none text-[#1b5ea8]"
      />
    )}
  </div>
)

// ヘッダー（濃紺）：タイトル・ステップアイコン・進捗バー
const StepHeader: React.FC = () => (
  <div className="bg-[#1b5ea8] px-5 pb-8 pt-6 text-white">
    <div className="mx-auto w-full max-w-[420px]">
      <p className="text-center text-2xl tracking-widest">仮審査申込</p>

      <div className="mt-5 flex items-end justify-between">
        {STEPS.map(({ label, Icon }, i) => (
          <div
            key={label}
            className="flex flex-1 flex-col items-center"
            aria-current={i === CURRENT_STEP ? 'step' : undefined}
          >
            <Icon
              width={i === CURRENT_STEP ? 30 : 26}
              height={i === CURRENT_STEP ? 30 : 26}
              className={i === CURRENT_STEP ? 'text-white' : 'text-white/45'}
            />
            {/* 現在ステップを指す三角 */}
            <span
              className={
                'mt-2 block size-0 border-x-[5px] border-t-[6px] border-x-transparent ' +
                (i === CURRENT_STEP ? 'border-t-white' : 'border-t-transparent')
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-sm bg-white">
        <div
          className="h-full bg-emerald-400"
          style={{ width: `${100 / STEPS.length / 2}%` }}
        />
      </div>
    </div>
  </div>
)

// 上下の区切り罫＋中央の下向き矢印（値が下に流れることを示す）
const ArrowDivider: React.FC = () => (
  <div className="relative mt-8 flex items-center" aria-hidden="true">
    <span className="h-px flex-1 bg-slate-200" />
    <span className="mx-1 size-3 -translate-y-1/2 rotate-45 border-b border-r border-slate-300" />
    <span className="h-px flex-1 bg-slate-200" />
  </div>
)

// オペレーターのイラストと電話導線
const OperatorSupport: React.FC = () => (
  <div className="mt-10 flex flex-col items-center">
    <OperatorAvatar />

    {/* 吹き出し（上向きの三角つき） */}
    <div className="relative mt-4 w-full rounded-xl border-2 border-emerald-400 bg-white px-5 py-5 text-center">
      <span className="absolute -top-2.5 left-1/2 size-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-emerald-400 bg-white" />
      <p className="text-[13px] font-bold text-emerald-500">
        操作や入力でお困りの際はお気軽にお電話ください
      </p>
    </div>

    <button
      type="button"
      className="mt-7 text-lg font-bold text-emerald-500 underline underline-offset-4"
    >
      ローンセンターの問合せ先はこちら
    </button>
  </div>
)

// ヘッドセットをつけたオペレーターの簡易イラスト
const OperatorAvatar: React.FC = () => (
  <svg
    viewBox="0 0 120 120"
    width={132}
    height={132}
    role="img"
    aria-label="オペレーター"
  >
    <circle cx="60" cy="58" r="44" fill="#dcf0fd" />
    {/* 肩・制服 */}
    <path
      d="M28 112c0-16 14-24 32-24s32 8 32 24z"
      fill="#8ab4e8"
      stroke="#2a6db5"
      strokeWidth="2.5"
    />
    {/* 髪（外側） */}
    <path
      d="M32 60c0-20 12-34 28-34s28 14 28 34c0 12-3 22-8 26H40c-5-4-8-14-8-26z"
      fill="#8d8b8b"
    />
    {/* 顔 */}
    <ellipse cx="60" cy="58" rx="19" ry="23" fill="#ffe2bd" />
    {/* 前髪 */}
    <path
      d="M41 52c2-16 10-24 19-24s17 8 19 22c-6-6-13-9-20-8-8 1-14 5-18 10z"
      fill="#f5cf8e"
    />
    {/* ヘッドセット */}
    <path
      d="M36 58a24 24 0 0148 0"
      fill="none"
      stroke="#8ab4e8"
      strokeWidth="5"
    />
    <rect x="31" y="54" width="9" height="18" rx="4.5" fill="#8ab4e8" />
    <rect x="80" y="54" width="9" height="18" rx="4.5" fill="#8ab4e8" />
    <path
      d="M36 72c0 8 6 12 12 13"
      fill="none"
      stroke="#5b5b5b"
      strokeWidth="2"
    />
    {/* スカーフ */}
    <path d="M60 88l-9 6 9 16 9-16z" fill="#5cc6e8" />
  </svg>
)
