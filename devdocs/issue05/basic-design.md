# 基本設計: 状態管理を Zustand でスマートにする

## 1. 目的

- `MainPage` に集中している `useState` 群と、各画面が持つローカル state を整理する。
- 「保持する状態」を最小化し、そこから計算できる値は **純粋関数（derive）** に寄せる。
- Zustand の推奨パターン（スライス・セレクタ・`useShallow`）を採用し、再レンダリングを抑えつつ読みやすくする。
- 初めての Zustand 学習を兼ねて、ベストプラクティスを本ドキュメントに集約する。

## 2. 現状の課題

現在の状態は主に [`MainPage.tsx`](../../src/MainPage.tsx) にまとまっている。

```ts
const [openId, setOpenId] = useState<string | null>(null)        // description を出す Phase
const [demoStep, setDemoStep] = useState(0)                      // デモの現在ステップ
const [uploadAction, setUploadAction] = useState<string | null>(null) // ファイル送信画面 + 対象書類
const [chatOpen, setChatOpen] = useState(false)                  // チャット画面
const [reservationOpen, setReservationOpen] = useState(false)    // 来店予約画面
```

課題:

- **画面表示の状態が3つの独立変数に分裂**している（`uploadAction` / `chatOpen` / `reservationOpen`）。同時に true になり得る書き方で、「今どの画面か」が一意に表現されていない。
- `unreadCount` / `progress` / `phases`（status 付き）などの **導出値が render 内に直書き**され、責務が混在している。
- デモのフェーズ送り（タイマー・SPACE キー）という **副作用が state と密結合**している。
- 各画面（`ChatPage` / `FileUploadPage` / `ReservationPage`）が持つローカル state と、親の state の切り分け方針が明文化されていない。

## 3. 設計方針

### 3.1 状態を3種類に分類する

| 種別 | 置き場所 | 例 |
| --- | --- | --- |
| **グローバル状態**（画面をまたいで共有・複数箇所から参照/更新） | Zustand ストア | 現在の Phase ID、アクティブ画面、送信対象の書類種別 |
| **導出状態**（他の状態から計算できる） | **保持しない**。純粋関数 or セレクタで都度計算 | status 付き phases、進捗率、未読件数 |
| **ローカル状態**（1画面内で完結する一時的な UI 状態） | 各コンポーネントの `useState` | チャット入力欄の文字列、アップロード完了フラグ、予約フォームの選択途中 |

> 原則: **「計算できるものは保持しない」**。`unreadCount` や `progress` は現在 Phase から一意に決まるので state にしない。

### 3.2 単一ストア + スライス構成

アプリ規模が小さいため、**1つの `useAppStore`** を作り、関心ごとに **スライス** で分割する。

- `phaseSlice`: デモのフェーズ進行
- `navigationSlice`: 表示中の画面（オーバーレイ）

## 4. ストア設計

### 4.1 画面（ナビゲーション）状態

3つの boolean/string を、**排他的な1つの discriminated union** に統合する。

```ts
// src/store/types.ts
export type Screen =
  | { kind: 'main' }
  | { kind: 'chat' }
  | { kind: 'reservation' }
  | { kind: 'fileUpload'; actionLabel: string } // 対象書類ラベルを payload で保持
```

これにより「今どの画面か」が一意になり、`uploadAction` の値と `chatOpen` の bool を別々に見る必要がなくなる。

### 4.2 ストアの型とスライス

```ts
// src/store/appStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Screen } from './types'
import { DEMO_SEQUENCE } from '../phases'

type PhaseSlice = {
  demoStep: number
  advancePhase: () => void
  setDemoStep: (step: number) => void
}

type NavigationSlice = {
  screen: Screen
  openChat: () => void
  openReservation: () => void
  openFileUpload: (actionLabel: string) => void
  openNotePhaseId: string | null
  showNote: (phaseId: string) => void
  closeNote: () => void
  backToMain: () => void
}

export type AppState = PhaseSlice & NavigationSlice

export const useAppStore = create<AppState>()(
  devtools((set) => ({
    // --- phaseSlice ---
    demoStep: 0,
    advancePhase: () =>
      set((s) => ({ demoStep: (s.demoStep + 1) % DEMO_SEQUENCE.length })),
    setDemoStep: (step) => set({ demoStep: step }),

    // --- navigationSlice ---
    screen: { kind: 'main' },
    openChat: () => set({ screen: { kind: 'chat' } }),
    openReservation: () => set({ screen: { kind: 'reservation' } }),
    openFileUpload: (actionLabel) =>
      set({ screen: { kind: 'fileUpload', actionLabel } }),
    backToMain: () => set({ screen: { kind: 'main' } }),

    openNotePhaseId: null,
    showNote: (phaseId) => set({ openNotePhaseId: phaseId }),
    closeNote: () => set({ openNotePhaseId: null }),
  })),
)
```

ポイント:

- **アクションはストア内に併置**する（setter を component 側に散らさない）。`set((s) => ...)` は関数形で書き、直前の state 依存を安全にする。
- `create<AppState>()(...)` の **カリー化した書き方**が Zustand v5 + TypeScript の推奨形。
- `devtools` ミドルウェアで Redux DevTools からアクション履歴を追える（学習・デバッグに有用）。

## 5. 純粋関数（derive）

導出ロジックを render から切り出し、**入力→出力が決まる純粋関数**として [`phases.ts`](../../src/phases.ts) 付近にまとめる。テストが容易になり、「状態を増やさない」方針を支える。

```ts
// src/phases.ts（追記）
export const DEMO_SEQUENCE = [
  'meeting-reservation', 'meeting', 'main-docs', 'main-result',
] as const

/** demoStep から現在の Phase ID を求める */
export const currentPhaseId = (demoStep: number): string =>
  DEMO_SEQUENCE[demoStep % DEMO_SEQUENCE.length]

/** 現在 Phase を起点に、各 Phase の status を導出する */
export const derivePhases = (currentId: string): Phase[] => {
  const currentIndex = PHASES.findIndex((p) => p.id === currentId)
  return PHASES.map((phase, i) => ({
    ...phase,
    status: i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'todo',
  }))
}

/** 進捗率（0-100）。current は 0.5 ステップとして扱う */
export const calcProgress = (phases: Phase[]): number => {
  const done = phases.filter((p) => p.status === 'done').length
  const hasCurrent = phases.some((p) => p.status === 'current')
  return Math.round(((done + (hasCurrent ? 0.5 : 0)) / phases.length) * 100)
}

/** 未読チャット件数（特定 Phase のときだけ 1 件、というデモ仕様） */
export const calcUnreadCount = (currentId: string): number =>
  currentId === 'main-docs' || currentId === 'main-result' ? 1 : 0
```

これらは Zustand に依存しない **ただの関数**。ユニットテスト対象にできる。

## 6. セレクタとレンダリング最適化

### 6.1 必要な値だけ購読する

コンポーネントは **セレクタで必要なフィールドだけ** を取り出す。ストア全体を返すと無関係な更新でも再レンダリングされるため避ける。

```ts
// 単一フィールド
const demoStep = useAppStore((s) => s.demoStep)
const advancePhase = useAppStore((s) => s.advancePhase)
```

### 6.2 複数フィールドは `useShallow`

複数の値をまとめて取り出すときは、毎回新しいオブジェクトが返って再レンダリングが起きないよう `useShallow` を使う。

```ts
import { useShallow } from 'zustand/react/shallow'

const { screen, backToMain } = useAppStore(
  useShallow((s) => ({ screen: s.screen, backToMain: s.backToMain })),
)
```

### 6.3 導出値はセレクタ内で純粋関数を呼ぶ

```ts
const currentId = useAppStore((s) => currentPhaseId(s.demoStep))
const phases = derivePhases(currentId)      // レンダー内で計算（軽いのでメモ不要、必要なら useMemo）
const progress = calcProgress(phases)
const unread = calcUnreadCount(currentId)
```

## 7. 副作用の扱い

デモ進行（タイマー・キーボード）は state ではなく **副作用**。ストアの `advancePhase` を呼ぶだけにし、`useEffect` 側に残す。「画面を開いている間は停止」の条件は `screen.kind` で判定する。

```ts
// MainPage 内
const screen = useAppStore((s) => s.screen)
const advancePhase = useAppStore((s) => s.advancePhase)

useEffect(() => {
  if (screen.kind !== 'main' || isDevMode) return
  const id = setInterval(advancePhase, DEMO_INTERVAL_MS)
  return () => clearInterval(id)
}, [screen.kind, advancePhase])
```

- `isDevMode`（URL パラメータ由来）は起動時に確定する定数なので state 化しない。
- SPACE キーのハンドラも同様に `advancePhase` を呼ぶだけにする。

## 8. 各画面のローカル状態は残す

以下は1画面内で完結する一時 UI 状態なので **ストアに載せず `useState` のまま**にする（グローバル化するとかえって複雑化する）。

- `ChatPage`: `messages` / `input`
- `FileUploadPage`: `uploaded` / `sent`
- `ReservationPage`: `topic` / `completed`

> 判断基準: 「画面を閉じたら破棄してよい」「他の画面が参照しない」state はローカル。

## 9. ディレクトリ構成（案）

```
src/
  store/
    appStore.ts      # useAppStore 本体（スライス統合）
    types.ts         # Screen 型など
  phases.ts          # PHASES データ + 純粋関数（derive/calc）
  MainPage.tsx       # セレクタで購読、副作用のみ保持
  ChatPage.tsx       # ローカル state のまま
  FileUploadPage.tsx
  ReservationPage.tsx
```

## 10. 移行ステップ

1. `phases.ts` に純粋関数（`currentPhaseId` / `derivePhases` / `calcProgress` / `calcUnreadCount`）を追加し、まず `MainPage` の render 内ロジックを置き換える（この時点では `useState` のまま）。
2. `src/store/` を作り `useAppStore` を実装。
3. `MainPage` の `openId` → `openNotePhaseId`、`demoStep`、`chatOpen`/`reservationOpen`/`uploadAction` → `screen` に置き換え、セレクタ購読へ移行。
4. `PhaseRow` などへ渡していた `onAction` / `onOpenNote` を、ストアのアクション直呼び or props 経由に整理。
5. 副作用（タイマー・キーボード）を `screen.kind` 判定に更新。
6. 各純粋関数へユニットテストを追加。

## 11. Zustand ベストプラクティスまとめ

- **状態は最小に、導出は関数で**。`progress` / `unread` / status 付き phases は保持しない。
- **アクションはストア内に併置**し、`set((s) => ...)` の関数形を基本にする。
- **セレクタで必要な分だけ購読**。複数取得は `useShallow`。ストア全体購読は避ける。
- **排他的な UI 状態は discriminated union**（`screen`）で一意に表現する。
- **ローカルで完結する一時状態は `useState` のまま**。何でもストアに入れない。
- **副作用は `useEffect` 側**に置き、ストアのアクションを呼ぶだけにする。
- **`create<T>()(...)` のカリー化記法** + `devtools` ミドルウェアで型と可観測性を確保。
- 純粋関数は Zustand 非依存にしておき、**単体テスト可能**に保つ。

## 12. 参考

- Zustand 公式ドキュメント（best practices / `useShallow` / slices pattern / middleware）
- 本リポジトリの [TypeScript ガイドライン](../../.claude/typescript.md)（`const` アロー関数・`type` 優先・`React.FC`）
