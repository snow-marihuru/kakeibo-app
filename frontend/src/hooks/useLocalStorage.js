import { useEffect, useState } from "react";

// 値の変更を自動でlocalStorageに保存し、リロード後も復元するフック
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error("localStorageの読み込みに失敗しました:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("localStorageの保存に失敗しました:", error);
    }
  }, [key, value]);

  return [value, setValue];
}
