import { useState, useEffect } from "react";
import API from "../api";
import Button from "./Button";
import Spinner from "./Spinner";
import { useToast } from "./toastContext";
import { formatMoney } from "../utils";

const EMPTY = { symbol: "", name: "", type: "stock", qty: "", buyPrice: "", currentPrice: "" };

const TYPE_LABELS = {
  stock: "Stock",
  mutual_fund: "Mutual Fund",
  crypto: "Crypto",
  other: "Other"
};

export default function Portfolio() {
  const [holdings, setHoldings] = useState([]);
  const [byType, setByType] = useState({});
  const [totals, setTotals] = useState({ invested: 0, marketValue: 0, gain: 0, gainPct: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const toast = useToast();

  const load = async () => {
    try {
      const { data } = await API.get("/portfolio");
      setHoldings(data.holdings);
      setTotals(data.totals);
      setByType(data.byType || {});
    } catch {
      toast("Could not load portfolio.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHolding = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post("/portfolio", {
        symbol: form.symbol,
        name: form.name,
        type: form.type,
        lots: [{ qty: form.qty, buyPrice: form.buyPrice }],
        currentPrice: form.currentPrice
      });
      toast("Holding added");
      setForm(EMPTY);
      setShowForm(false);
      load();
    } catch (err) {
      toast(err?.response?.data?.msg || "Failed to add holding.", "error");
    } finally {
      setSaving(false);
    }
  };

  const updatePrice = async (id, currentPrice) => {
    if (!currentPrice) return;
    try {
      await API.put(`/portfolio/${id}/price`, { currentPrice });
      toast("Price updated", "info");
      load();
    } catch {
      toast("Failed to update price.", "error");
    }
  };

  const removeHolding = async (id) => {
    if (!window.confirm("Remove this holding and all its lots?")) return;
    try {
      await API.delete(`/portfolio/${id}`);
      toast("Holding removed", "info");
      load();
    } catch {
      toast("Failed to remove holding.", "error");
    }
  };

  const sellLot = async (id, lotId) => {
    try {
      await API.delete(`/portfolio/${id}/lots/${lotId}`);
      toast("Lot sold", "info");
      load();
    } catch (err) {
      toast(err?.response?.data?.msg || "Failed to sell lot.", "error");
    }
  };

  const sellQuantity = async (h, qty, sellPrice) => {
    if (!qty || Number(qty) <= 0) {
      toast("Enter a quantity to sell.", "error");
      return;
    }
    if (Number(qty) > h.totalQty) {
      toast("Cannot sell more than you hold.", "error");
      return;
    }
    try {
      await API.post(`/portfolio/${h.id}/sell`, { qty, sellPrice });
      toast("Sold", "info");
      load();
    } catch (err) {
      toast(err?.response?.data?.msg || "Sell failed.", "error");
    }
  };

  const saveMeta = async (id, updates) => {
    try {
      await API.put(`/portfolio/${id}`, updates);
      toast("Holding updated", "info");
      load();
    } catch (err) {
      toast(err?.response?.data?.msg || "Update failed.", "error");
    }
  };

  const saveLot = async (hId, lotId, updates) => {
    try {
      await API.put(`/portfolio/${hId}/lots/${lotId}`, updates);
      toast("Lot updated", "info");
      load();
    } catch (err) {
      toast(err?.response?.data?.msg || "Lot update failed.", "error");
    }
  };

  const addLot = async (h, qty, buyPrice) => {
    if (!qty || !buyPrice) {
      toast("Enter quantity and buy price.", "error");
      return;
    }
    try {
      await API.post("/portfolio", {
        symbol: h.symbol,
        name: h.name,
        type: h.type,
        lots: [{ qty, buyPrice }]
      });
      toast("Lot added", "info");
      load();
    } catch (err) {
      toast(err?.response?.data?.msg || "Failed to add lot.", "error");
    }
  };

  return (
    <section className="card">
      <div className="card-head">
        <h2>📈 Portfolio</h2>
        <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Holding"}
        </button>
      </div>

      {totals.gain !== 0 && (
        <div className="portfolio-summary">
          <div className="ps-row">
            <span>Invested</span>
            <strong>{formatMoney(totals.invested)}</strong>
          </div>
          <div className="ps-row">
            <span>Market Value</span>
            <strong>{formatMoney(totals.marketValue)}</strong>
          </div>
          <div className="ps-row">
            <span>Profit / Loss</span>
            <strong className={totals.gain >= 0 ? "inc" : "exp"}>
              {formatMoney(totals.gain)} ({totals.gainPct >= 0 ? "+" : ""}
              {totals.gainPct.toFixed(2)}%)
            </strong>
          </div>
          {Object.keys(byType).length > 0 && (
            <div className="ps-type-breakdown">
              {Object.entries(byType).map(([type, t]) => (
                <span key={type} className="ps-type-chip">
                  {TYPE_LABELS[type] || type}:&nbsp;
                  <strong className={t.gain >= 0 ? "inc" : "exp"}>
                    {formatMoney(t.gain)}
                  </strong>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {showForm && (
        <form className="tx-form pf-form" onSubmit={submitHolding}>
          <div className="pf-row2">
            <div className="field">
              <label>Symbol</label>
              <input
                type="text"
                placeholder="AAPL"
                value={form.symbol}
                onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {Object.entries(TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Name (optional)</label>
            <input
              type="text"
              placeholder="Apple"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="pf-row3">
            <div className="field">
              <label>Quantity</label>
              <input
                type="number"
                min="0"
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Buy Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.buyPrice}
                onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Cur. Price (optional)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.currentPrice}
                onChange={(e) => setForm({ ...form, currentPrice: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" disabled={saving} className="btn-block">
            {saving ? <Spinner /> : "Add Holding"}
          </Button>
        </form>
      )}

      {loading ? (
        <div className="list-loading"><Spinner /> Loading…</div>
      ) : holdings.length === 0 ? (
        <p className="empty-note">No holdings yet. Add one to track profit/loss.</p>
      ) : (
        <div className="holding-list">
          {holdings.map((h) => (
            <HoldingRow
              key={h.id}
              h={h}
              expanded={expandedId === h.id}
              onToggle={() => setExpandedId(expandedId === h.id ? null : h.id)}
              onUpdatePrice={updatePrice}
              onRemove={removeHolding}
              onSellLot={sellLot}
              onSellQty={sellQuantity}
              onSaveMeta={saveMeta}
              onSaveLot={saveLot}
              onAddLot={addLot}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function HoldingRow({
  h,
  expanded,
  onToggle,
  onUpdatePrice,
  onRemove,
  onSellLot,
  onSellQty,
  onSaveMeta,
  onSaveLot,
  onAddLot
}) {
  const [meta, setMeta] = useState({ name: h.name, type: h.type });
  const [editLotId, setEditLotId] = useState(null);
  const [lotDraft, setLotDraft] = useState(null);
  const [sellQty, setSellQty] = useState("");
  const [sellPrice, setSellPrice] = useState(h.currentPrice || "");
  const [newQty, setNewQty] = useState("");
  const [newBuyPrice, setNewBuyPrice] = useState("");

  const [prevSnapshot, setPrevSnapshot] = useState({
    name: h.name,
    type: h.type,
    currentPrice: h.currentPrice
  });
  if (
    prevSnapshot.name !== h.name ||
    prevSnapshot.type !== h.type ||
    prevSnapshot.currentPrice !== h.currentPrice
  ) {
    setPrevSnapshot({ name: h.name, type: h.type, currentPrice: h.currentPrice });
    setMeta({ name: h.name, type: h.type });
    setSellPrice(h.currentPrice || "");
  }

  const startEditLot = (lot) => {
    setEditLotId(lot._id);
    setLotDraft({ qty: lot.qty, buyPrice: lot.buyPrice, buyDate: lot.buyDate?.slice?.(0, 10) });
  };

  const commitMeta = () => onSaveMeta(h.id, meta);
  const commitLot = () => {
    if (!lotDraft) return;
    const updates = {};
    if (lotDraft.qty && Number(lotDraft.qty) > 0) updates.qty = lotDraft.qty;
    if (lotDraft.buyPrice && Number(lotDraft.buyPrice) > 0) updates.buyPrice = lotDraft.buyPrice;
    if (lotDraft.buyDate) updates.buyDate = lotDraft.buyDate;
    onSaveLot(h.id, editLotId, updates);
    setEditLotId(null);
  };

  return (
    <div className="holding-row">
      <div className="holding-sym">{h.symbol.slice(0, 4)}</div>
      <div className="holding-main">
        <div className="holding-top-line">
          <span className="holding-name">
            {h.name || h.symbol}{" "}
            <span className="holding-type">{TYPE_LABELS[h.type] || h.type}</span>
          </span>
          <span className="holding-meta">
            {h.totalQty} @ {formatMoney(h.avgBuyPrice).slice(1)}
          </span>
        </div>
        <div className="holding-controls">
          <HoldingPriceInput key={h.id} defaultValue={h.currentPrice || ""} onSubmit={(v) => onUpdatePrice(h.id, v)} />
          <span className={h.gain >= 0 ? "txn-amount inc" : "txn-amount exp"}>
            {h.gain >= 0 ? "+" : "-"}
            {formatMoney(Math.abs(h.gain)).slice(1)}
            <small>{h.gain >= 0 ? "+" : ""}{h.gainPct.toFixed(2)}%</small>
          </span>
          <button className="icon-btn" onClick={onToggle} aria-label="Edit holding">
            ✎
          </button>
          <button className="icon-btn" onClick={() => onRemove(h.id)} aria-label="Remove holding">
            🗑
          </button>
        </div>
      </div>

      {expanded && (
        <div className="holding-detail">
          <div className="hd-section">
            <div className="hd-title">Holding details</div>
            <div className="hd-grid">
              <div className="field">
                <label>Name</label>
                <input
                  type="text"
                  value={meta.name}
                  onChange={(e) => setMeta({ ...meta, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Type</label>
                <select
                  value={meta.type}
                  onChange={(e) => setMeta({ ...meta, type: e.target.value })}
                >
                  {Object.entries(TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="hd-actions">
              <Button variant="ghost" className="btn-sm" onClick={commitMeta}>
                Save details
              </Button>
            </div>
          </div>

          <div className="hd-section">
            <div className="hd-title">Lots ({h.lots.length})</div>
            <div className="hd-lots">
              {h.lots.map((lot) =>
                editLotId === lot._id ? (
                  <div className="hd-lot hd-lot-edit" key={lot._id}>
                    {["qty", "buyPrice", "buyDate"].map((f) => (
                      <div className="field" key={f}>
                        <label>{f === "buyDate" ? "Buy date" : f}</label>
                        <input
                          type={f === "buyDate" ? "date" : "number"}
                          min={f === "buyDate" ? undefined : "0"}
                          step={f === "buyPrice" ? "0.01" : undefined}
                          value={lotDraft?.[f] ?? ""}
                          onChange={(e) => setLotDraft({ ...lotDraft, [f]: e.target.value })}
                        />
                      </div>
                    ))}
                    <div className="hd-lot-actions">
                      <Button className="btn-sm" onClick={commitLot}>Save</Button>
                      <Button variant="ghost" className="btn-sm" onClick={() => setEditLotId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="hd-lot" key={lot._id}>
                    <div className="hd-lot-info">
                      <strong>{lot.qty}</strong> @ {formatMoney(lot.buyPrice).slice(1)}
                      <span className="holding-meta">
                        {lot.buyDate ? new Date(lot.buyDate).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <div className="hd-lot-actions">
                      <button className="icon-btn" onClick={() => startEditLot(lot)} aria-label="Edit lot">✎</button>
                      <button className="icon-btn" onClick={() => onSellLot(h.id, lot._id)} aria-label="Sell lot">💰</button>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="hd-inline-actions">
              <span className="hd-title">Add lot</span>
              <div className="hd-grid">
                <div className="field">
                  <label>Quantity</label>
                  <input type="number" min="0" value={newQty} onChange={(e) => setNewQty(e.target.value)} />
                </div>
                <div className="field">
                  <label>Buy price</label>
                  <input type="number" min="0" step="0.01" value={newBuyPrice} onChange={(e) => setNewBuyPrice(e.target.value)} />
                </div>
              </div>
              <Button className="btn-sm" onClick={() => { onAddLot(h, newQty, newBuyPrice); setNewQty(""); setNewBuyPrice(""); }}>
                + Add
              </Button>
            </div>
          </div>

          <div className="hd-section">
            <div className="hd-title">Sell</div>
            <div className="hd-grid">
              <div className="field">
                <label>Quantity</label>
                <input type="number" min="0" value={sellQty} onChange={(e) => setSellQty(e.target.value)} />
              </div>
              <div className="field">
                <label>Sell price</label>
                <input type="number" min="0" step="0.01" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
              </div>
            </div>
            <div className="hd-actions">
              <Button variant="primary" className="btn-sm" onClick={() => onSellQty(h, sellQty, sellPrice)}>
                Sell {sellQty ? `${sellQty} Qty` : ""}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HoldingPriceInput({ defaultValue, onSubmit }) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <input
      type="number"
      step="0.01"
      className="price-input"
      placeholder="cur. price"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={(e) => e.target.value && onSubmit(e.target.value)}
    />
  );
}