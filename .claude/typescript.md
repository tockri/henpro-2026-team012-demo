---
applyTo: ['**/*.ts', '**/*.tsx']
description: TypeScriptのコーディングガイドライン
---

# TypeScriptコーディングガイドライン

## 関数宣言はfunctionよりconst アロー関数

関数宣言は下記のようにconstで書く

```ts
const myFunc = (arg1: Arg1Type): RetType => ....
```

## 型宣言はinterfaceよりtype

型は下記のようにtypeで書く

```ts
type MyType = {
    :
    :
}
```

## ReactコンポーネントはReact.FC

関数コンポーネントの宣言は下記のようにReact.FCで書く

```tsx
export type MyProps = {
    :
    :
}

export const MyComponent: React.FC<MyProps> = (props) => {
    :
    :
    return (
        <elem>
            :
        </elem>
    )
}
```
