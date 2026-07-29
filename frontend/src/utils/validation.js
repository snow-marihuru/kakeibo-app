// レシートデータの検証ロジック

// 商品の中に金額が負の値のものがあれば警告メッセージを返す（なければnull）
export function checkNegativePrices(items) {
  const negativeItems = items.filter((item) => item.price < 0);
  if (negativeItems.length === 0) return null;

  const names = negativeItems.map((item) => item.name).join("、");
  return `金額が負の値になっている商品があります: ${names}`;
}

// 同一の日付・合計金額のレシートが既に登録されていれば警告メッセージを返す（なければnull）
export function checkDuplicateReceipt({ date, total }, existingItems) {
  const totalsByReceipt = new Map();
  existingItems.forEach((item) => {
    if (!item.receiptId) return;
    const receipt = totalsByReceipt.get(item.receiptId) ?? { date: item.date, total: 0 };
    receipt.total += item.price;
    totalsByReceipt.set(item.receiptId, receipt);
  });

  const isDuplicate = [...totalsByReceipt.values()].some(
    (receipt) => receipt.date === date && receipt.total === total,
  );

  if (!isDuplicate) return null;
  return `同じ日付（${date}）・合計金額（¥${total.toLocaleString()}）のレシートが既に登録されています。`;
}
