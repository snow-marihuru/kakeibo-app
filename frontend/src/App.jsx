import { useCallback, useState } from "react";
import "./App.css";
import CategoryPieChart from "./components/CategoryPieChart";
import MonthlyBarChart from "./components/MonthlyBarChart";
import ReceiptList from "./components/ReceiptList";
import ReceiptUpload from "./components/ReceiptUpload";
import WarningBanner from "./components/WarningBanner";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { checkDuplicateReceipt, checkNegativePrices } from "./utils/validation";

function App() {
  const [items, setItems] = useLocalStorage("kakeibo-items", []);
  const [warnings, setWarnings] = useState([]);

  // 解析結果（1レシート分の複数商品）を検証したうえで一覧データに追加する
  const handleAnalyzed = useCallback(
    (result) => {
      const receiptId = crypto.randomUUID();
      const newItems = (result.items || []).map((item) => ({
        id: crypto.randomUUID(),
        receiptId,
        date: result.date,
        store: result.store,
        name: item.name,
        price: item.price,
        category: item.category,
      }));

      const total = newItems.reduce((sum, item) => sum + item.price, 0);
      const newWarnings = [
        checkDuplicateReceipt({ date: result.date, total }, items),
        checkNegativePrices(newItems),
      ].filter(Boolean);

      setWarnings(newWarnings);
      setItems((prev) => [...prev, ...newItems]);
    },
    [items, setItems],
  );

  const handleDelete = useCallback(
    (id) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [setItems],
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>レシート家計簿</h1>
        <p>レシート画像をアップロードすると自動で内容を読み取ります</p>
      </header>

      <main className="app-main">
        <ReceiptUpload onAnalyzed={handleAnalyzed} />

        <WarningBanner warnings={warnings} onDismiss={() => setWarnings([])} />

        <div className="chart-grid">
          <CategoryPieChart items={items} />
          <MonthlyBarChart items={items} />
        </div>

        <ReceiptList items={items} onDelete={handleDelete} />
      </main>
    </div>
  );
}

export default App;
