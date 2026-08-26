# CLAUDE.md

## 開発サーバー

- devサーバー（`bun run dev`）はユーザーが自分で起動・管理します。
- Claudeはdevサーバーを起動しないでください（`preview_start` や `bun run dev` を実行しない）。
- 表示確認が必要な場合は、ユーザーが起動済みのサーバーで確認するよう促してください。

## ブラウザでのチェック

- devサーバーは5173ポートで起動しているので、`http://localhost:5173/`にアクセスして動作確認してください。

## TypeScriptコード

`*.ts`や`*.tsx`コードを読み書きするときは [typescript.md](./.claude/typescript.md) を参照する。
