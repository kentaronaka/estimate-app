import { useState } from "react";
import "./App.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


type LineItem = {
  id: number;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
};

type EstimateData = {
  title: string;
  customerName: string;
  projectName: string;
  issueDate: string;
  items: LineItem[];
};

type StoredEstimate = EstimateData & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

const TAX_RATE = 0.1; // 10%
const STORAGE_KEY = "estimate-app/estimates-v1";

// 空の見積を作る
const createEmptyEstimate = (): EstimateData & { items: LineItem[] } => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return {
    title: "御見積書",
    customerName: "",
    projectName: "",
    issueDate: `${yyyy}-${mm}-${dd}`,
    items: [{ id: 1, description: "", quantity: 1, unit: "式", unitPrice: 0 }],
  };
};

function App() {
  // 現在編集中の見積
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

  // 保存済み見積一覧
  const [estimates, setEstimates] = useState<StoredEstimate[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as StoredEstimate[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // 今開いている見積のID（新規なら null）
  const [currentId, setCurrentId] = useState<string | null>(null);

  // 行の金額
  const calcLineAmount = (item: LineItem) =>
    item.quantity * item.unitPrice;

  // 小計
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

  // 一覧を localStorage に保存
  const saveListToStorage = (list: StoredEstimate[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  // 🆕 新規見積
  const handleNewEstimate = () => {
    const empty = createEmptyEstimate();
    setTitle(empty.title);
    setCustomerName(empty.customerName);
    setProjectName(empty.projectName);
    setIssueDate(empty.issueDate);
    setItems(empty.items);
    setCurrentId(null);
  };

  // 💾 見積を保存／上書き
  const handleSaveEstimate = () => {
    const now = new Date().toISOString();
    const baseData: EstimateData = {
      title,
      customerName,
      projectName,
      issueDate,
      items,
    };

    setEstimates((prev) => {
      let next: StoredEstimate[];
      if (currentId) {
        // 既存上書き
        next = prev.map((est) =>
          est.id === currentId
            ? {
                ...est,
                ...baseData,
                updatedAt: now,
              }
            : est
        );
      } else {
        // 新規追加
        const newId = String(Date.now());
        const newEstimate: StoredEstimate = {
          id: newId,
          createdAt: now,
          updatedAt: now,
          ...baseData,
        };
        next = [newEstimate, ...prev];
        setCurrentId(newId);
      }
      saveListToStorage(next);
      return next;
    });

    alert("見積を保存しました。");
  };

  // 📂 一覧から開く
  const handleOpenEstimate = (id: string) => {
    const target = estimates.find((e) => e.id === id);
    if (!target) {
      alert("データが見つかりませんでした。");
      return;
    }
    setTitle(target.title);
    setCustomerName(target.customerName);
    setProjectName(target.projectName);
    setIssueDate(target.issueDate);
    setItems(
      target.items && target.items.length > 0
        ? target.items
        : [{ id: 1, description: "", quantity: 1, unit: "式", unitPrice: 0 }]
    );
    setCurrentId(target.id);
  };

  // 🗑 一覧から削除
  const handleDeleteEstimate = (id: string) => {
    if (!confirm("この見積を削除しますか？")) return;
    setEstimates((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveListToStorage(next);
      return next;
    });

    if (currentId === id) {
      const empty = createEmptyEstimate();
      setTitle(empty.title);
      setCustomerName(empty.customerName);
      setProjectName(empty.projectName);
      setIssueDate(empty.issueDate);
      setItems(empty.items);
      setCurrentId(null);
    }
  };

  // 🧾 PDF出力（A4縦）
  const handleExportPdf = async () => {
    if (items.length === 0) {
      alert("明細がありません。");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // 日本語フォントを public フォルダから読み込み、jsPDF に登録する
    // フォントファイルを `public/fonts/NotoSansJP-Regular.ttf` に配置してください。
    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
      let binary = "";
      const bytes = new Uint8Array(buffer);
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, (chunk as unknown) as number[]);
      }
      return btoa(binary);
    };

    try {
      const fontUrl = "/fonts/NotoSansJP-Regular.ttf";
      const resp = await fetch(fontUrl);
      if (resp.ok) {
        const buf = await resp.arrayBuffer();
        const b64 = arrayBufferToBase64(buf);
        try {
          (doc as any).addFileToVFS("NotoSansJP-Regular.ttf", b64);
          (doc as any).addFont("NotoSansJP-Regular.ttf", "NotoSansJP", "normal");
          doc.setFont("NotoSansJP");
        } catch (e) {
          // addFileToVFS/addFont が無い場合は jsPDF のバージョン違いの可能性がある
          console.warn("フォント登録に失敗しました。日本語が文字化けする可能性があります。", e);
        }
      } else {
        console.warn("フォントファイルを取得できませんでした:", fontUrl);
      }
    } catch (e) {
      console.warn("フォント読み込み中にエラーが発生しました:", e);
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 15;

    // タイトル
    doc.setFontSize(16);
    doc.text(title || "御見積書", pageWidth / 2, y, { align: "center" });
    y += 10;

    doc.setFontSize(10);

    // 見積日・顧客名・案件名
    if (issueDate) {
      doc.text(`見積日: ${issueDate}`, pageWidth - 20, y, {
        align: "right",
      });
      y += 6;
    }

    if (customerName) {
      doc.text(`御中: ${customerName}`, 20, y);
      y += 6;
    }

    if (projectName) {
      doc.text(`案件名: ${projectName}`, 20, y);
      y += 8;
    } else {
      y += 4;
    }

    // テーブル（明細）
    const body = items.map((item, index) => [
      String(index + 1),
      item.description || "",
      item.quantity ? String(item.quantity) : "",
      item.unit || "",
      item.unitPrice ? item.unitPrice.toLocaleString() : "",
      (item.quantity * item.unitPrice).toLocaleString(),
    ]);

    // autoTable を直接呼び出す（プラグインを関数としてインポート）
    autoTable(doc as any, {
      head: [["No", "品名・内容", "数量", "単位", "単価", "金額"]],
      body,
      startY: y,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 70 },
        2: { cellWidth: 15, halign: "right" },
        3: { cellWidth: 15 },
        4: { cellWidth: 25, halign: "right" },
        5: { cellWidth: 25, halign: "right" },
      },
    });
    
        const finalY =
          ((doc as any).lastAutoTable && (doc as any).lastAutoTable.finalY) ||
          y + 40;

    // 小計・税・合計
    let summaryY = finalY + 10;
    doc.setFontSize(11);
    doc.text(
      `小計：${subTotal.toLocaleString()} 円`,
      pageWidth - 20,
      summaryY,
      { align: "right" }
    );
    summaryY += 6;
    doc.text(
      `消費税（${(TAX_RATE * 100).toFixed(0)}%）：${tax.toLocaleString()} 円`,
      pageWidth - 20,
      summaryY,
      { align: "right" }
    );
    summaryY += 6;
    doc.setFontSize(12);
    doc.text(`合計：${total.toLocaleString()} 円`, pageWidth - 20, summaryY, {
      align: "right",
    });

    // ファイル名
    const safeProject = (projectName || "estimate").replace(/[\\/:*?"<>|]/g, "_");
    const safeCustomer = (customerName || "").replace(/[\\/:*?"<>|]/g, "_");
    const fileNameParts = [safeProject, safeCustomer, issueDate].filter(
      Boolean
    );
    const fileName =
      (fileNameParts.join("_") || "estimate") + ".pdf";

    doc.save(fileName);
  };

  // 日付表示用（一覧）
  const formatDate = (iso: string) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const mi = String(d.getMinutes()).padStart(2, "0");
      return `${yyyy}/${mm}/${dd} ${hh}:${mi}`;
    } catch {
      return iso;
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1100px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      {/* 左側：編集エリア */}
      <div>
        <h1 style={{ marginBottom: "8px" }}>{title}</h1>

        <div style={{ marginBottom: "8px" }}>
          <button onClick={handleNewEstimate}>🆕 新規見積</button>
          <button
            onClick={handleSaveEstimate}
            style={{ marginLeft: "8px" }}
          >
            💾 この見積を保存／上書き
          </button>
          <button
            onClick={handleExportPdf}
            style={{ marginLeft: "8px" }}
          >
            📄 PDF出力（A4縦）
          </button>
        </div>

        {/* 見積ヘッダー */}
        <section
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "16px",
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
                style={{ width: "70%" }}
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
                style={{ width: "70%" }}
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
          {currentId && (
            <div style={{ marginTop: "4px", fontSize: "0.8rem", color: "#555" }}>
              編集中の見積ID：{currentId}
            </div>
          )}
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
                    <td
                      style={{ border: "1px solid #ccc", padding: "4px" }}
                    >
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "description",
                            e.target.value
                          )
                        }
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td
                      style={{ border: "1px solid #ccc", padding: "4px" }}
                    >
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            e.target.value
                          )
                        }
                        style={{ width: "80px", textAlign: "right" }}
                      />
                    </td>
                    <td
                      style={{ border: "1px solid #ccc", padding: "4px" }}
                    >
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) =>
                          handleItemChange(item.id, "unit", e.target.value)
                        }
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td
                      style={{ border: "1px solid #ccc", padding: "4px" }}
                    >
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "unitPrice",
                            e.target.value
                          )
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

      {/* 右側：保存済み見積一覧 */}
      <aside
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "12px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: "1rem", marginBottom: "8px" }}>
          📂 保存済み見積一覧
        </h2>
        {estimates.length === 0 ? (
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            まだ保存された見積はありません。
          </div>
        ) : (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {estimates.map((est) => (
              <li
                key={est.id}
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "8px 0",
                  fontSize: "0.9rem",
                }}
              >
                <div
                  style={{
                    fontWeight:
                      currentId === est.id ? "bold" : "normal",
                  }}
                >
                  {est.projectName || est.customerName || "（名称未設定）"}
                </div>
                <div style={{ color: "#666" }}>
                  作成：{formatDate(est.createdAt)}
                </div>
                <div style={{ color: "#666" }}>
                  更新：{formatDate(est.updatedAt)}
                </div>
                <div style={{ marginTop: "4px" }}>
                  <button onClick={() => handleOpenEstimate(est.id)}>
                    開く
                  </button>
                  <button
                    onClick={() => handleDeleteEstimate(est.id)}
                    style={{ marginLeft: "4px" }}
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}

export default App;
