import { useEffect, useState } from 'react'
import {
  ArrowLeftIcon,
  LockClosedIcon,
  MobileIcon,
  DesktopIcon,
  CameraIcon,
  ReloadIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons'

// 「Life Plan Coach 証券確認サービス」を模した外部サイト画面。
// 住宅ローンナビ（indigo基調）・住宅ローンポータル（濃紺基調）とは別サービスなので、
// 温かみのあるベージュ＋深いティールのトーンで構成する。

export type InsuranceCheckPageProps = {
  onBack: () => void
  /** 証券の確認が完了したときに呼ばれる */
  onChecked: () => void
}

/** 確認完了を記録するときの名前（uploadedActionNames のキー） */
export const INSURANCE_CHECK_NAME = '保険証券'

const SERVICE_URL = 'lifeplan-coach.example.com'

/** 読み取り中の演出にかける時間 */
const ANALYZING_MS = 1800

// 画面の進行段階
type Step = 'intro' | 'camera' | 'analyzing' | 'result'

// 読み取り結果として見せる保障の内訳
const COVERAGES = [
  { label: '死亡保障', amount: '3,000万円', ratio: 100 },
  { label: '医療保障', amount: '日額 10,000円', ratio: 62 },
  { label: 'がん保障', amount: '一時金 100万円', ratio: 40 },
  { label: '就業不能保障', amount: '未加入', ratio: 0 },
] as const

export const InsuranceCheckPage: React.FC<InsuranceCheckPageProps> = ({
  onBack,
  onChecked,
}) => {
  const [step, setStep] = useState<Step>('intro')
  const [device, setDevice] = useState<'smartphone' | 'pc'>('smartphone')

  // 読み取り中の演出が終わったら結果を表示し、確認済みとして記録する
  useEffect(() => {
    if (step !== 'analyzing') return
    const timer = setTimeout(() => {
      setStep('result')
      onChecked()
    }, ANALYZING_MS)
    return () => clearTimeout(timer)
  }, [step, onChecked])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-100 animate-fade-in">
      {/* 疑似ブラウザのアドレスバー */}
      <div className="flex flex-none items-center gap-2 bg-stone-200 px-3 py-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="戻る"
          className="flex size-8 flex-none items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-300"
        >
          <ArrowLeftIcon width={18} height={18} />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-stone-500">
          <LockClosedIcon
            width={13}
            height={13}
            className="flex-none text-emerald-600"
          />
          <span className="truncate text-xs">{SERVICE_URL}</span>
        </div>
      </div>

      {/* サービスのコンテンツ */}
      <div className="flex-1 overflow-y-auto">
        {step === 'intro' && (
          <IntroScreen
            device={device}
            onDeviceChange={setDevice}
            onStart={() => setStep('camera')}
          />
        )}
        {step === 'camera' && (
          <CameraScreen onShoot={() => setStep('analyzing')} />
        )}
        {step === 'analyzing' && <AnalyzingScreen />}
        {step === 'result' && <ResultScreen onBack={onBack} />}
      </div>
    </div>
  )
}

// --- 各段階の画面 ---

type IntroScreenProps = {
  device: 'smartphone' | 'pc'
  onDeviceChange: (device: 'smartphone' | 'pc') => void
  onStart: () => void
}

// トップ画面。写真の上にロゴとキャッチコピーを重ねたヒーロー構成。
const IntroScreen: React.FC<IntroScreenProps> = ({
  device,
  onDeviceChange,
  onStart,
}) => (
  <div className="relative flex min-h-full flex-col justify-center overflow-hidden bg-stone-700">
    <HeroBackdrop />

    <div className="relative mx-auto w-full max-w-[420px] px-6 py-14 text-white">
      <ServiceLogo />

      <p className="mt-6 text-center text-[17px] font-bold leading-relaxed drop-shadow">
        生命保険証券をカメラで撮って
        <br />
        保障のカタチをカンタン確認！
      </p>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 w-full rounded-lg border border-white/70 bg-white/15 py-6 text-center text-xl font-bold tracking-wide text-white backdrop-blur-sm transition hover:bg-white/25 active:scale-95"
      >
        確認スタート
      </button>

      {/* 端末の選択（見た目上のトグル） */}
      <div className="mx-auto mt-5 flex w-full max-w-[320px] overflow-hidden rounded-md border border-white/60">
        <DeviceTab
          label="スマートフォン"
          Icon={MobileIcon}
          selected={device === 'smartphone'}
          onSelect={() => onDeviceChange('smartphone')}
        />
        <DeviceTab
          label="PC"
          Icon={DesktopIcon}
          selected={device === 'pc'}
          onSelect={() => onDeviceChange('pc')}
        />
      </div>
    </div>
  </div>
)

type CameraScreenProps = {
  onShoot: () => void
}

// 撮影画面。疑似ファインダーの中に証券を収めてシャッターを押す。
const CameraScreen: React.FC<CameraScreenProps> = ({ onShoot }) => (
  <div className="flex min-h-full flex-col bg-stone-900 px-5 py-8 animate-fade-in">
    <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col">
      <p className="text-center text-[15px] font-bold text-white">
        保険証券を枠内に収めてください
      </p>
      <p className="mt-1.5 text-center text-xs text-white/60">
        明るい場所で、影が入らないように撮影してください
      </p>

      {/* ファインダー */}
      <div className="relative mt-7 aspect-[3/4] w-full overflow-hidden rounded-xl bg-stone-800">
        <PolicyPreview />
        <FinderCorners />
      </div>

      {/* シャッター */}
      <div className="mt-9 flex flex-none justify-center">
        <button
          type="button"
          onClick={onShoot}
          aria-label="撮影する"
          className="flex size-20 items-center justify-center rounded-full border-4 border-white/70 bg-white/10 text-white transition active:scale-90"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-white text-stone-800">
            <CameraIcon width={26} height={26} />
          </span>
        </button>
      </div>
    </div>
  </div>
)

// 読み取り中の画面
const AnalyzingScreen: React.FC = () => (
  <div className="flex min-h-full flex-col items-center justify-center bg-stone-900 px-6 text-center animate-fade-in">
    <ReloadIcon
      width={44}
      height={44}
      className="animate-spin text-teal-300"
      style={{ animationDuration: '1.4s' }}
    />
    <p className="mt-6 text-lg font-bold text-white">証券を読み取っています</p>
    <p className="mt-2 text-sm text-white/60">
      保障内容を解析しています。少々お待ちください。
    </p>
  </div>
)

type ResultScreenProps = {
  onBack: () => void
}

// 読み取り結果（保障のカタチ）を表示する画面
const ResultScreen: React.FC<ResultScreenProps> = ({ onBack }) => (
  <div className="min-h-full bg-stone-100 pb-12 animate-fade-in">
    <div className="bg-teal-700 px-6 pb-10 pt-9 text-center text-white">
      <CheckCircledIcon width={52} height={52} className="mx-auto" />
      <p className="mt-3 text-xl font-bold">確認が完了しました</p>
      <p className="mt-1.5 text-sm text-white/80">
        1件の保険証券を読み取りました
      </p>
    </div>

    <div className="mx-auto w-full max-w-[420px] px-5">
      <div className="-mt-6 rounded-2xl bg-white p-5 shadow-lg shadow-stone-400/20">
        <p className="text-xs text-stone-400">ご契約</p>
        <p className="mt-0.5 text-[15px] font-bold text-stone-800">
          総合保障保険（終身）
        </p>
        <p className="mt-1 text-xs text-stone-500">
          保険料 月額 18,400円 ／ 契約日 2019年4月1日
        </p>

        <p className="mt-6 text-sm font-bold text-stone-700">保障のカタチ</p>
        <div className="mt-3 space-y-4">
          {COVERAGES.map((coverage) => (
            <CoverageBar key={coverage.label} {...coverage} />
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50 p-4">
        <p className="text-sm font-bold text-teal-800">
          ライフプランコーチからのひとこと
        </p>
        <p className="mt-2 text-sm leading-relaxed text-teal-900/80">
          就業不能保障が未加入です。住宅ローンのご返済が始まると、働けなくなったときの備えが重要になります。ご面談で一緒に見直しましょう。
        </p>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-7 w-full rounded-lg bg-teal-700 py-4 text-center text-[15px] font-bold text-white shadow-md transition active:scale-95"
      >
        住宅ローンナビに戻る
      </button>
    </div>
  </div>
)

// --- 部品 ---

type DeviceTabProps = {
  label: string
  Icon: React.FC<{ width?: number; height?: number; className?: string }>
  selected: boolean
  onSelect: () => void
}

// 「スマートフォン / PC」の切り替えチップ
const DeviceTab: React.FC<DeviceTabProps> = ({
  label,
  Icon,
  selected,
  onSelect,
}) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={selected}
    className={
      'flex flex-1 items-center justify-center gap-2 py-2.5 text-sm transition ' +
      (selected ? 'bg-white text-stone-700' : 'bg-white/20 text-white')
    }
  >
    <Icon width={15} height={15} className="flex-none" />
    <span className="tracking-wide">{label}</span>
  </button>
)

// ヒーローの背景（写真の代わりに、暖色のぼかしとドット網点で質感を出す）
const HeroBackdrop: React.FC = () => (
  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
    <div className="absolute inset-0 bg-gradient-to-br from-stone-500 via-stone-600 to-stone-800" />
    <div className="absolute -left-16 top-8 size-72 rounded-full bg-amber-200/25 blur-3xl" />
    <div className="absolute -right-12 top-1/3 size-64 rounded-full bg-orange-300/20 blur-3xl" />
    <div className="absolute bottom-0 left-1/4 size-80 rounded-full bg-stone-900/40 blur-3xl" />
    <div
      className="absolute inset-0 opacity-25"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '5px 5px',
      }}
    />
  </div>
)

// サービスロゴ（Life Plan Coach ／ 証券確認サービス）
const ServiceLogo: React.FC = () => (
  <div className="text-center">
    <div className="relative inline-block pr-24">
      <p className="pl-1 text-left text-[11px] tracking-[0.45em] text-white/90">
        ライフプランコーチ
      </p>
      <p className="font-serif text-5xl italic leading-none tracking-tight text-white drop-shadow-lg">
        Life Plan
        <span className="align-super text-xs not-italic">®</span>
      </p>
      <span className="absolute right-0 top-0 -rotate-6 font-serif text-3xl italic text-white drop-shadow-lg">
        Coach
      </span>
    </div>
    <p className="mt-3 text-[32px] font-bold tracking-[0.12em] text-white drop-shadow-lg">
      証券確認サービス
    </p>
  </div>
)

// ファインダー内に映る保険証券のプレビュー
const PolicyPreview: React.FC = () => (
  <div className="absolute inset-6 rotate-[-2deg] rounded-sm bg-stone-50 p-4 shadow-2xl">
    <p className="text-[10px] tracking-widest text-stone-400">
      INSURANCE POLICY
    </p>
    <p className="mt-1 text-sm font-bold text-stone-700">保険証券</p>
    <div className="mt-4 space-y-2">
      {[92, 78, 85, 60, 88, 72, 45].map((width, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full bg-stone-200"
          style={{ width: `${width}%` }}
        />
      ))}
    </div>
    <div className="mt-5 h-10 w-20 rounded-sm border border-stone-200 bg-stone-100" />
  </div>
)

// ファインダーの四隅のガイド
const FinderCorners: React.FC = () => (
  <div className="absolute inset-3" aria-hidden="true">
    <span className="absolute left-0 top-0 size-8 border-l-4 border-t-4 border-teal-300" />
    <span className="absolute right-0 top-0 size-8 border-r-4 border-t-4 border-teal-300" />
    <span className="absolute bottom-0 left-0 size-8 border-b-4 border-l-4 border-teal-300" />
    <span className="absolute bottom-0 right-0 size-8 border-b-4 border-r-4 border-teal-300" />
  </div>
)

type CoverageBarProps = {
  label: string
  amount: string
  ratio: number
}

// 保障の1項目（横棒グラフ）
const CoverageBar: React.FC<CoverageBarProps> = ({ label, amount, ratio }) => (
  <div>
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-stone-600">{label}</span>
      <span
        className={
          'text-sm font-bold ' +
          (ratio === 0 ? 'text-rose-500' : 'text-stone-800')
        }
      >
        {amount}
      </span>
    </div>
    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-stone-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600 transition-[width] duration-700"
        style={{ width: `${ratio}%` }}
      />
    </div>
  </div>
)
