import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import { CATEGORY_COLORS } from "../constants/categories";

ChartJS.register(ArcElement, Tooltip, Legend);

// カテゴリごとの支出合計を円グラフで表示するコンポーネント
function CategoryPieChart({ items }) {
  const totalsByCategory = {};
  items.forEach((item) => {
    totalsByCategory[item.category] = (totalsByCategory[item.category] || 0) + item.price;
  });

  const labels = Object.keys(totalsByCategory);
  const chartData = {
    labels,
    datasets: [
      {
        data: labels.map((label) => totalsByCategory[label]),
        backgroundColor: labels.map((label) => CATEGORY_COLORS[label] || "#94a3b8"),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <section className="card">
      <h2>カテゴリ別支出</h2>
      {labels.length === 0 ? (
        <p className="empty-message">データがありません。</p>
      ) : (
        <div className="chart-wrapper">
          <Pie data={chartData} options={{ plugins: { legend: { position: "right" } } }} />
        </div>
      )}
    </section>
  );
}

export default CategoryPieChart;
