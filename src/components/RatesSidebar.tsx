// ...existing code...
import React from "react";
import ratesData from "../data/rates.json";

type RateItem = {
  id: string;
  name: string;
  unit: string;
  price: number;
};

export default function RatesSidebar({
  onInsert,
}: {
  onInsert: (item: { description: string; unit: string; unitPrice: number }) => void;
}) {
  return (
    <aside style={{ padding: 12, marginTop: 12 }}>
      <h4 style={{ margin: "6px 0" }}>単価データベース</h4>
      {ratesData.categories.map((cat: any) => (
        <div key={cat.id} style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>{cat.label}</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {cat.items.map((it: RateItem) => (
              <li
                key={it.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "1px dashed #eee",
                }}
              >
                <div>
                  <div>{it.name}</div>
                  <div style={{ color: "#666", fontSize: "0.85rem" }}>
                    {it.unit}・{it.price.toLocaleString()} 円
                  </div>
                </div>
                <div>
                  <button
                    onClick={() =>
                      onInsert({ description: it.name, unit: it.unit, unitPrice: it.price })
                    }
                  >
                    挿入
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
// ...existing code...