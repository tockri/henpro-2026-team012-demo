# 状態管理をZustandでスマートにする

状態管理がごちゃついてきたので、きれいにしたい。
Zustandを導入したので、コードをきれいにして、純粋関数を増やして、Zustandのスマートな書き方を学習したい。
Zustandは初めてなので、ベストプラクティスを案内してほしい。

## 状態の候補

### 表示している画面

- MainPage
- ChatPage
- FileUploadPage
- ReservationPage

### MainPage内の状態（例）

- 現在のPhase ID
- アップロードが終わったファイルの種類
- descriptionを表示するPhase ID
- チャットの未読件数（バッヂの数字）

### 他のPage内の状態

他のPageについても同様に状態を定義して、場当たり的なbooleanフラグの集合ではなく、Page内の状態を一つの型として定義し、ZustandのSliceを使って拡張性の高いコードにしたい。
