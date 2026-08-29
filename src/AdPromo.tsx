import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Cross2Icon, CheckIcon, ChevronRightIcon } from '@radix-ui/react-icons'

// 住宅ローン以外の商品もおすすめするための広告枠。
// 控えめなバナーをタップすると、全画面オーバーレイで詳細を表示する。
export type AdPromoProps = {
  onReserve: () => void
}

export const AdPromo: React.FC<AdPromoProps> = ({ onReserve }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* 控えめな広告バナー */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative mt-7 mb-3 flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 px-4 py-3 text-left shadow-sm ring-1 ring-black/5 backdrop-blur transition active:scale-[0.99]"
      >
        <span className="flex-none rounded-md bg-slate-100 text-[22px] font-semibold tracking-wide text-slate-400">
          ℹ️
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-700">
            その住宅ローン、本当に最適ですか？
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            金融機関ごとに金利や団信の内容は少しずつ異なります。
          </p>
        </div>
        <ChevronRightIcon
          width={18}
          height={18}
          className="flex-none text-slate-400 transition group-active:translate-x-0.5"
        />
      </button>

      {/* 全画面オーバーレイ広告（おすすめ訴求。説明のPhaseNoteとは別デザイン） */}
      {/* main の stacking context を抜けるため body 直下に portal する */}
      {open &&
        createPortal(
          <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="住宅ローン相談のご案内"
        >
          <div
            className="relative w-full max-w-[400px] overflow-hidden rounded-[28px] bg-gradient-to-b from-amber-50 to-white shadow-2xl ring-1 ring-amber-200/60 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="閉じる"
              className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-white/70 text-slate-500 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <Cross2Icon width={18} height={18} />
            </button>

            <div className="px-7 pb-8 pt-9 text-center">
              <span className="inline-block rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold tracking-wide text-amber-700">
                住宅ローン選びのヒント
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-snug tracking-tight text-slate-800">
                その住宅ローン、
                <br />
                本当に最適ですか？
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                金融機関ごとに金利や団信の内容は
                <br className="hidden xs:block" />
                少しずつ異なります。
              </p>
            </div>

            <div className="mx-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <p className="text-center text-base font-bold text-slate-800">
                さらに<span className="text-amber-600">◯◯銀行</span>なら、
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  '生命保険と団信の保障内容をまとめて確認',
                  '住宅購入後の家計収支をチェック',
                  'ライフプランをふまえた住宅ローン選びをサポート',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-5 flex-none items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      <CheckIcon width={14} height={14} />
                    </span>
                    <span className="text-[15px] leading-relaxed text-slate-600">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-7 pb-8 pt-6 text-center">
              <p className="text-[15px] font-semibold text-slate-700">
                まずは来店して相談してみませんか？
              </p>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onReserve()
                }}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-amber-900/25 transition active:scale-95"
              >
                来店予約はこちら
                <ChevronRightIcon width={18} height={18} />
              </button>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </>
  )
}
