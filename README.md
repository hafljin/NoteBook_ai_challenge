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

## 🎯 主要なコンポーネント

### アプリケーション層 (`app/`)
- **Expo Router**: ファイルベースのルーティング
- **タブナビゲーション**: メイン画面と設定画面
- **エディター**: ノートの作成・編集・削除機能

### コンポーネント層 (`components/`)
- **NoteCard**: ノート一覧での各ノート表示
- **SearchBar**: ノート検索機能
- **FloatingActionButton**: 新規ノート作成ボタン
- **DeleteConfirmModal**: 削除確認ダイアログ

### ビジネスロジック層 (`hooks/`, `services/`)
- **useNotes**: ノートのCRUD操作を管理
- **NoteStorage**: AsyncStorageを使用したデータ永続化

## 🚀 セットアップ

### 前提条件
- Node.js (v18以上)
- npm または yarn
- Expo CLI
- iOS Simulator または Android Emulator

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### ビルド

```bash
# Web用ビルド
npm run build:web

# iOS/Android用ビルド
expo build:ios
expo build:android
```

## 📱 使用方法

1. **ノートの作成**: フローティングアクションボタン（+）をタップ
2. **ノートの編集**: ノートカードをタップしてエディターを開く
3. **ノートの削除**: エディター画面の削除ボタン（🗑️）をタップ
4. **複数ノート削除**: ノートを長押しして選択モードに入り、複数選択して削除
5. **ノートの検索**: 検索バーにキーワードを入力
6. **カテゴリー絞り込み**: 複数のカテゴリーを選択してノートを絞り込み
7. **設定**: タブバーの設定アイコンをタップ

## 🎨 UI/UX 特徴

- **モダンなデザイン**: iOS/Androidのネイティブ感を重視
- **ダークモード対応**: システム設定に応じた自動切り替え
- **直感的な操作**: タップ、スワイプ、長押しでの操作
- **レスポンシブ**: 様々な画面サイズに対応
- **アクセシビリティ**: 適切なコントラストとタッチターゲット
- **複数選択**: カテゴリーとノートの複数選択機能

## 🔧 開発者向け情報

### 型定義
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
```

### 主要なフック
```typescript
const { notes, loading, error, createNote, updateNote, deleteNote } = useNotes();
```

### ストレージキー
- ノートデータ: `quicknote_notes`

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。大きな変更を行う前に、まずイシューで議論してください。

## 📞 サポート

問題が発生した場合や質問がある場合は、GitHubのイシューを作成してください。 