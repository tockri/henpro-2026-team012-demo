import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Cross2Icon,
  ChevronRightIcon,
  BarChartIcon,
} from '@radix-ui/react-icons'

// 「家計の見直し」への任意導線。
// 手続きの本線（indigo）でも広告枠（amber）でもない第3のトーンとして teal を使う。
// 破線のゴーストボタン＋「任意」チップで、必須ではないことを形で示す。
// 来店予約画面で初期選択する相談内容（ReservationPage の TOPICS と一致させる）
export const BUDGET_REVIEW_TOPIC = '支出の見直しに関するご相談'

export type BudgetReviewProps = {
  onReserve: () => void
}

// ライフイベントの重なりを示す簡易バー（今〜30年後）
type LifeBar = {
  label: string
  left: number // %
  width: number // %
  className: string
}

const LIFE_BARS: LifeBar[] = [
  {
    label: '住宅ローン返済',
    left: 0,
    width: 100,
    className: 'bg-teal-500/70',
  },
  {
    label: '教育費（進学〜大学）',
    left: 28,
    width: 38,
    className: 'bg-rose-300',
  },
  {
    label: '車の買い替え',
    left: 20,
    width: 7,
    className: 'bg-slate-300',
  },
]

const MERITS: string[] = [
  '団信と、いまご加入の生命保険。保障が重なっていないか確認できます',
  '教育費や車の買い替えなど、これからの出費と返済の重なりを見渡せます',
  '借入額や返済期間を決めるときの、判断材料になります',
]

export const BudgetReview: React.FC<BudgetReviewProps> = ({ onReserve }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 任意導線のゴーストボタン（塗りなし・破線） */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group mt-7 mb-3 flex w-full items-center gap-3 rounded-2xl border border-dashed border-teal-300 bg-white px-4 py-3 text-left transition active:scale-[0.99]"
      >
        <span className="flex size-8 flex-none items-center justify-center rounded-xl bg-teal-50 text-teal-600">
          <BarChartIcon width={17} height={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
            家計の見直し
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
              任意
            </span>
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            お手続きには影響しません
          </p>
        </div>
        <ChevronRightIcon
          width={16}
          height={16}
          className="flex-none text-slate-300 transition group-active:translate-x-0.5"
        />
      </button>

      {/* 説明はボトムシート。いつでも下に流して消せる感覚を優先する */}
      {/* main の stacking context を抜けるため body 直下に portal する */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/30 animate-fade-in"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="家計の見直しのご案内"
          >
            <div
              className="relative flex max-h-[80vh] w-full max-w-[420px] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ドラッグハンドル（見た目のみ） */}
              <div className="flex flex-none justify-center pt-3">
                <span className="h-1 w-10 rounded-full bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="閉じる"
                className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100"
              >
                <Cross2Icon width={18} height={18} />
              </button>

              <div className="flex-1 overflow-y-auto px-6 pb-2 pt-4">
                <span className="inline-block rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-teal-700">
                  ライフプランのご提案
                </span>
                <h2 className="mt-3 text-xl font-bold leading-snug tracking-tight text-slate-800">
                  住宅ローンは、家計を見直す
                  <br />
                  「ちょうどいいタイミング」です
                </h2>

                <LifeEventChart />

                <ul className="mt-5 divide-y divide-slate-100 border-y border-slate-100">
                  {MERITS.map((text) => (
                    <li
                      key={text}
                      className="py-3 text-[14px] leading-relaxed text-slate-600"
                    >
                      {text}
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-xs leading-relaxed text-slate-400">
                  ご相談は任意です。いまのお手続きを進めたうえで、あとからご相談いただくこともできます。
                </p>
              </div>

              {/* CTA。来店予約FAB（amber）と見分けがつくよう teal で */}
              <div className="flex-none px-6 pb-7 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    onReserve()
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-full bg-teal-600 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-teal-900/20 transition active:scale-95"
                >
                  ライフプランアドバイザーに面談予約する
                  <ChevronRightIcon width={17} height={17} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mx-auto mt-3 block px-4 py-1 text-sm text-slate-400"
                >
                  あとで検討する
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

const LifeEventChart: React.FC = () => (
  <div className="mt-5 rounded-2xl bg-slate-50 p-4">
    <div className="space-y-2.5">
      {LIFE_BARS.map((bar) => (
        <div key={bar.label}>
          <p className="text-[11px] text-slate-500">{bar.label}</p>
          <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-white">
            <div
              className={'h-full rounded-full ' + bar.className}
              style={{
                marginLeft: `${bar.left}%`,
                width: `${bar.width}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
    <div className="mt-2 flex justify-between text-[10px] text-slate-400">
      <span>いま</span>
      <span>10年後</span>
      <span>20年後</span>
      <span>30年後</span>
    </div>
    <p className="mt-3 text-xs leading-relaxed text-slate-500">
      返済と教育費が重なる時期を、いまのうちに把握しておけます。
    </p>
  </div>
)
