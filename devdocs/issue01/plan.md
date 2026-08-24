# 作業計画・記録 (issue01: 初期実装)

## 目的
Bunテンプレートの初期デモ実装を削除し、`requirements.md`の画面を作り始めるための空白ページにする。

## 作業内容
- [x] デモファイル削除: `src/APITester.tsx`, `src/logo.svg`, `src/react.svg`
- [x] `src/App.tsx` をスマホ縦画面前提の空白ページに書き換え
- [x] `src/index.css` からBun背景アニメーション等のデモ用スタイルを削除
- [x] `src/index.html` のタイトル・favicon をアプリ向けに変更
- [x] `src/index.ts` からデモ用APIルート(`/api/hello`)を削除
- [x] ビルド確認 (`bun run build`)

## 残す資産
- `src/components/ui/*` (shadcn UIコンポーネント) はそのまま利用
- `styles/globals.css` のテーマ定義はそのまま
- Bunの開発サーバ構成 (`serve` + `index.html`) は維持
