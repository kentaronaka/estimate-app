import React from "react";
import "./Nav.css";

type Props = {
  onNew: () => void;
  onToggleSaved: () => void;
  showSaved: boolean;
};

export default function Nav({ onNew, onToggleSaved, showSaved }: Props) {
  return (
    <nav className="ea-nav">
      <div className="ea-nav-left">
        <div className="ea-app-name">見積アプリ</div>
      </div>
      <div className="ea-nav-right">
        <button onClick={onNew}>🆕 新規作成</button>
        <button onClick={onToggleSaved} style={{ marginLeft: 8 }}>
          {showSaved ? "🔽 保存一覧を閉じる" : "🔽 保存一覧を開く"}
        </button>
      </div>
    </nav>
  );
}
