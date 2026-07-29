import { CATEGORY_COLORS } from "../constants/categories";

// 登録済みレシートを日付の新しい順に一覧表示するコンポーネント
function ReceiptList({ items, onDelete }) {
  const sortedItems = [...items].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section className="card">
      <h2>登録済みレシート一覧</h2>
      {sortedItems.length === 0 ? (
        <p className="empty-message">まだレシートが登録されていません。</p>
      ) : (
        <div className="table-wrapper">
          <table className="receipt-table">
            <thead>
              <tr>
                <th>日付</th>
                <th>店名</th>
                <th>商品名</th>
                <th>カテゴリ</th>
                <th>金額</th>
                <th aria-label="操作"></th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.store || "-"}</td>
                  <td>{item.name}</td>
                  <td>
                    <span
                      className="category-badge"
                      style={{
                        color: CATEGORY_COLORS[item.category] || "#64748b",
                        backgroundColor: `${CATEGORY_COLORS[item.category] || "#64748b"}22`,
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className={`price-cell${item.price < 0 ? " price-negative" : ""}`}>
                    ¥{item.price.toLocaleString()}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-delete"
                      onClick={() => onDelete(item.id)}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default ReceiptList;
