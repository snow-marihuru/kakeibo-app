// レシート家計簿アプリのバックエンドサーバー
// ブラウザから直接Claude APIキーを扱わないよう、ここでAPI呼び出しを中継する
import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import Anthropic from "@anthropic-ai/sdk";
import { CATEGORIES } from "./categories.js";

const app = express();
const port = process.env.PORT || 3001;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 画像はメモリ上で扱い、ディスクに保存しない（最大10MB）
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.use(cors());
app.use(express.json());

// レシート画像を解析し、日付・商品名・金額・カテゴリを抽出する
app.post("/api/analyze-receipt", upload.single("receipt"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "画像ファイルが送信されていません。" });
    }

    const base64Image = req.file.buffer.toString("base64");
    const mediaType = req.file.mimetype;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(mediaType)) {
      return res.status(400).json({ error: "対応していない画像形式です。" });
    }

    const today = new Date().toISOString().slice(0, 10);

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system:
        "あなたはレシート画像を解析する家計簿アプリのアシスタントです。" +
        "画像から購入日と商品ごとの品名・金額を読み取り、以下のカテゴリの中から最も適切なものを1つ選んで分類してください。\n" +
        `カテゴリ一覧: ${CATEGORIES.join("、")}\n` +
        "出力は必ず次のJSON形式のみとし、説明文やMarkdownのコードブロックは一切含めないでください。\n" +
        '{"date":"YYYY-MM-DD","store":"店名（読み取れない場合は空文字）","items":[{"name":"商品名","price":数値,"category":"カテゴリ名"}]}\n' +
        `日付が読み取れない場合は "${today}" を使用してください。金額は税込みの数値（円）のみを入れてください。`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: "このレシート画像を解析し、指定されたJSON形式で結果を返してください。",
            },
          ],
        },
      ],
    });

    const rawText = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    const jsonText = extractJson(rawText);
    const parsed = JSON.parse(jsonText);

    // カテゴリが未知の値だった場合は「その他」にフォールバック
    const items = (parsed.items || []).map((item) => ({
      name: String(item.name ?? "不明な商品"),
      price: Number(item.price) || 0,
      category: CATEGORIES.includes(item.category) ? item.category : "その他",
    }));

    res.json({
      date: parsed.date || today,
      store: parsed.store || "",
      items,
    });
  } catch (error) {
    console.error("レシート解析エラー:", error);
    res.status(500).json({ error: "レシートの解析に失敗しました。時間をおいて再度お試しください。" });
  }
});

// Claudeの応答からコードブロック等を取り除き、JSON部分のみを抽出する
function extractJson(text) {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) return fenceMatch[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return text.slice(start, end + 1);
  }
  return text;
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`家計簿バックエンドサーバーがポート ${port} で起動しました`);
});
