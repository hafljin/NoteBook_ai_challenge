# QuickNote - Expo React Native ノートアプリ

モダンなReact NativeとExpoを使用して構築された、シンプルで使いやすいノートアプリです。

## 🚀 機能

- 📝 ノートの作成・編集・削除
- 🔍 ノートの検索機能
- 🏷️ カテゴリー機能（複数選択対応）
- 📱 レスポンシブなUI（iOS/Android対応）
- 🌙 ダークモード対応
- 💾 ローカルストレージ（AsyncStorage）
- ⚡ 高速なパフォーマンス
- 🗑️ 複数選択削除機能

## 🛠 技術スタック

- **フレームワーク**: Expo SDK 53
- **言語**: TypeScript
- **ナビゲーション**: Expo Router
- **状態管理**: React Hooks
- **ストレージ**: AsyncStorage
- **UI**: React Native + Lucide React Native
- **フォント**: Inter Font Family

## 📁 プロジェクト構造

```
NoteBook/
├── app/                    # Expo Router アプリケーション
│   ├── (tabs)/            # タブナビゲーション
│   │   ├── index.tsx      # メイン画面（ノート一覧）
│   │   ├── settings.tsx   # 設定画面
│   │   └── _layout.tsx    # タブレイアウト
│   ├── editor.tsx         # ノートエディター
│   ├── _layout.tsx        # ルートレイアウト
│   └── +not-found.tsx     # 404ページ
├── components/            # 再利用可能なコンポーネント
│   ├── NoteCard.tsx       # ノートカード
│   ├── SearchBar.tsx      # 検索バー
│   ├── FloatingActionButton.tsx # フローティングアクションボタン
│   └── DeleteConfirmModal.tsx   # 削除確認モーダル
├── hooks/                 # カスタムフック
│   └── useNotes.ts        # ノート管理フック
├── services/              # サービス層
│   └── noteStorage.ts     # ローカルストレージ管理
├── types/                 # TypeScript型定義
│   └── Note.ts           # ノート型定義
├── assets/               # 画像・アイコン等
│   └── images/
├── app.json              # Expo設定
├── package.json          # 依存関係
└── tsconfig.json         # TypeScript設定
``` 