// データ検証で見つかった警告メッセージを表示するコンポーネント
function WarningBanner({ warnings, onDismiss }) {
  if (warnings.length === 0) return null;

  return (
    <div className="warning-banner" role="alert">
      <ul>
        {warnings.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
      <button type="button" className="btn btn-dismiss" onClick={onDismiss}>
        閉じる
      </button>
    </div>
  );
}

export default WarningBanner;
