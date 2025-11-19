import { useState } from "react";
import "./App.css";

type LineItem = {
  id: number;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
};

const TAX_RATE = 0.1; // 10%

function App() {
  const [title, setTitle] = useState("御見積書");
  const [customerName, setCustomerName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [issueDate, setIssueDate] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });

  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "", quantity: 1, unit: "式", unitPrice: 0 },
  ]);

  const calcLineAmount = (item: LineItem) =>
    item.quantity * item.unitPrice;

  const subTotal = items.reduce(
    (sum, item) => sum + calcLineAmount(item),
    0
  );

  const tax = Math.round(subTotal * TAX_RATE);
  const total = subTotal + tax;

  const handleItemChange = (
    id: number,
    field: keyof LineItem,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "quantity" || field === "unitPrice"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        description: "",
        quantity: 1,
        unit: "",
        unitPrice: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "16px" }}>{title}</h1>

      {/* 見積ヘッダー */}
      <section
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "24px",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <label>
            顧客名：{" "}
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ width: "60%" }}
              placeholder="〇〇株式会社 御中"
            />
          </label>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <label>
            案件名：{" "}
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={{ width: "60%" }}
              placeholder="〇〇工事に関する御見積"
            />
          </label>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <label>
            見積日：{" "}
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </label>
        </div>
      </section>

      {/* 明細テーブル */}
      <section>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "16px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                No
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                品名・内容
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                数量
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                単位
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                単価
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                金額
              </th>
              <th style={{ border: "1px solid #ccc", padding: "4px" }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const amount = calcLineAmount(item);
              return (
                <tr key={item.id}>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, "description", e.target.value)
                      }
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(item.id, "quantity", e.target.value)
                      }
                      style={{ width: "80px", textAlign: "right" }}
                    />
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) =>
                        handleItemChange(item.id, "unit", e.target.value)
                      }
                      style={{ width: "80px" }}
                    />
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "4px" }}>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(item.id, "unitPrice", e.target.value)
                      }
                      style={{ width: "100px", textAlign: "right" }}
                    />
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "4px",
                      textAlign: "right",
                    }}
                  >
                    {amount.toLocaleString()}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    <button onClick={() => handleRemoveItem(item.id)}>
                      削除
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button onClick={handleAddItem}>＋ 行を追加</button>
      </section>

      {/* 合計表示 */}
      <section
        style={{
          marginTop: "24px",
          borderTop: "1px solid #ccc",
          paddingTop: "16px",
          textAlign: "right",
        }}
      >
        <div>小計：{subTotal.toLocaleString()} 円</div>
        <div>消費税（10%）：{tax.toLocaleString()} 円</div>
        <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          合計：{total.toLocaleString()} 円
        </div>
      </section>
    </div>
  );
}

export default App;
