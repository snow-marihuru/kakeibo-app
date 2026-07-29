# レシート家計簿アプリ

レシート画像をアップロードすると、Claude APIが商品名・金額・日付を自動で読み取り、カテゴリ別に分類・集計する家計簿Webアプリです。

## 構成

- `backend/`: Node.js (Express) 製のAPIサーバー。Claude APIの呼び出しはここでのみ行う。
- `frontend/`: React (Vite) 製のUI。Chart.jsでグラフ表示、データはブラウザのlocalStorageに保存。

## セットアップ

### 1. バックエンド

```bash
cd backend
npm install
cp .env.example .env
```

`.env` を開き、Claude APIキーを設定します。

```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxx
```

起動:

```bash
npm start
```

`http://localhost:3001` でAPIサーバーが起動します。

### 2. フロントエンド

別のターミナルで:

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:5173` にアクセスするとアプリが表示されます。`/api` へのリクエストはVite設定によりバックエンド(3001番ポート)へ自動的に中継されます。

## 使い方

1. 「レシートを読み込む」からレシート画像を選択し、「読み取る」ボタンを押す
2. Claude APIが解析した商品名・金額・日付・カテゴリが一覧に追加される
3. カテゴリ別円グラフ・月別棒グラフが自動更新される
4. 登録データはlocalStorageに保存されるため、ページをリロードしても消えない

## 注意事項

- Claude APIキーはバックエンドの `.env` のみで管理し、`.gitignore` によりコミット対象外になっています。
- 使用モデル: `claude-haiku-4-5-20251001`
