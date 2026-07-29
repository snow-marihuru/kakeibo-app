import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// 月ごとの支出合計を棒グラフで表示するコンポーネント
function MonthlyBarChart({ items }) {
  const totalsByMonth = {};
  items.forEach((item) => {
    const month = item.date ? item.date.slice(0, 7) : "不明";
    totalsByMonth[month] = (totalsByMonth[month] || 0) + item.price;
  });

  const months = Object.keys(totalsByMonth).sort();
  const chartData = {
    labels: months,
    datasets: [
      {
        label: "月別支出合計（円）",
        data: months.map((month) => totalsByMonth[month]),
        backgroundColor: "#2563eb",
        borderRadius: 4,
      },
    ],
  };

  return (
    <section className="card">
      <h2>月別支出</h2>
      {months.length === 0 ? (
        <p className="empty-message">データがありません。</p>
      ) : (
        <div className="chart-wrapper">
          <Bar
            data={chartData}
            options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      )}
    </section>
  );
}

export default MonthlyBarChart;
