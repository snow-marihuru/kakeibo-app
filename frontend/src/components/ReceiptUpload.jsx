import { useRef, useState } from "react";

// レシート画像を選択し、バックエンド経由でClaude APIに解析させるコンポーネント
function ReceiptUpload({ onAnalyzed }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] ?? null;
    setError("");
    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("receipt", file);

      const response = await fetch("/api/analyze-receipt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "レシートの解析に失敗しました。");
      }

      const result = await response.json();
      onAnalyzed(result);

      setFile(null);
      setPreviewUrl(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err.message || "レシートの解析に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card upload-card">
      <h2>レシートを読み込む</h2>
      <div className="upload-controls">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={!file || loading}
        >
          {loading ? "解析中..." : "読み取る"}
        </button>
      </div>

      {previewUrl && (
        <img src={previewUrl} alt="レシートのプレビュー" className="preview-image" />
      )}
      {error && <p className="error-message">{error}</p>}
    </section>
  );
}

export default ReceiptUpload;
