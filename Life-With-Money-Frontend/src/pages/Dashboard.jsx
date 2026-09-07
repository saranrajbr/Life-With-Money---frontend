import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import AppLayout from "../components/AppLayout";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import { useToast } from "../components/toastContext";
import API from "../api";
import { useCategories, formatMoney, todayStr, groupTransactionsByDate } from "../utils";

const EMPTY_FORM = { type: "expense", category: "", amount: "", description: "" };

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, net: 0 });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const { categories, loading: catLoading, labelFor } = useCategories();
  const toast = useToast();

  const loadDay = async (dateStr) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/transactions?range=day&dateStr=${dateStr}`);
      setTransactions(data.transactions);
      setSummary(data.summary);
      setSelectedDate(dateStr);
    } catch {
      toast("Could not load transactions.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDay(todayStr());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateClick = (info) => {
    loadDay(info.dateStr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.amount) {
      toast("Select a category and enter an amount.", "error");
      return;
    }
    setSaving(true);
    try {
      await API.post("/transactions", {
        type: form.type,
        category: form.category,
        amount: form.amount,
        description: form.description,
        dateStr: selectedDate
      });
      toast(form.type === "income" ? "Income added" : "Expense added");
      setForm(EMPTY_FORM);
      loadDay(selectedDate);
    } catch (err) {
      toast(err?.response?.data?.msg || "Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  const removeTransaction = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      toast("Transaction deleted", "info");
      loadDay(selectedDate);
    } catch {
      toast("Failed to delete.", "error");
    }
  };

  const categoryList = form.type === "expense" ? categories.expense : categories.income;

  const grouped = groupTransactionsByDate(transactions);

  return (
    <AppLayout>
      <div className="page">
        <header className="page-head">
          <div>
            <h1>Dashboard</h1>
            <p className="page-head-sub">Log and review your daily transactions.</p>
          </div>
          <div className="date-badge">{selectedDate}</div>
        </header>

        <div className="dash-grid">
          {/* Calendar */}
          <section className="card calendar-card">
            <div className="card-head">
              <h2>Financial Calendar</h2>
              <span className="card-head-sub">Tap a day to log entries</span>
            </div>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              dateClick={handleDateClick}
              dayCellClassNames={(arg) =>
                arg.dateStr === selectedDate ? ["selected-day"] : []
              }
            />
          </section>

          {/* Entry form */}
          <section className="card entry-card">
            <div className="card-head">
              <h2>Add Transaction</h2>
              <span className="card-head-sub">{selectedDate}</span>
            </div>

            <div className="type-seg">
              <button
                type="button"
                className={form.type === "expense" ? "active expense-on" : ""}
                onClick={() => setForm({ ...EMPTY_FORM, type: "expense" })}
              >
                Expense
              </button>
              <button
                type="button"
                className={form.type === "income" ? "active income-on" : ""}
                onClick={() => setForm({ ...EMPTY_FORM, type: "income" })}
              >
                Income
              </button>
            </div>

            <form onSubmit={handleSubmit} className="tx-form">
              <div className="field">
                <label htmlFor="category">Category</label>
                {catLoading ? (
                  <div className="field-loading"><Spinner size={14} /> Loading categories…</div>
                ) : (
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    <option value="">Select a category</option>
                    {categoryList.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="field">
                <label htmlFor="amount">Amount</label>
                <div className="amount-input">
                  <span className="amount-currency">₹</span>
                  <input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="description">Note (optional)</label>
                <input
                  id="description"
                  type="text"
                  placeholder="e.g. weekly groceries"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={saving} className="btn-block">
                {saving ? <Spinner /> : `Add ${form.type === "income" ? "Income" : "Expense"}`}
              </Button>
            </form>
          </section>

          {/* Day summary */}
          <section className="card totals-card">
            <div className="card-head">
              <h2>Today's Totals</h2>
            </div>
            <div className="totals-grid">
              <div className="total-box">
                <span className="total-label">Income</span>
                <span className="total-value inc">{formatMoney(summary.totalIncome)}</span>
              </div>
              <div className="total-box">
                <span className="total-label">Spent</span>
                <span className="total-value exp">{formatMoney(summary.totalExpense)}</span>
              </div>
              <div className="total-box">
                <span className="total-label">Net</span>
                <span className={`total-value ${summary.net >= 0 ? "inc" : "exp"}`}>
                  {formatMoney(summary.net)}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Transactions list */}
        <section className="card txn-card">
          <div className="card-head">
            <h2>Transactions</h2>
            <span className="card-head-sub">for {selectedDate}</span>
          </div>

          {loading ? (
            <div className="list-loading"><Spinner /> Loading…</div>
          ) : grouped.length === 0 ? (
            <p className="empty-note">No transactions yet for this day.</p>
          ) : (
            <div className="txn-list">
              {grouped.map(([date, items]) => (
                <div key={date} className="txn-group">
                  <div className="txn-group-head">{date}</div>
                  {items.map((tx) => (
                    <div className="txn-row" key={tx._id}>
                      <div className="txn-row-main">
                        <span className={`txn-icon ${tx.type}`}>
                          {tx.type === "income" ? "＋" : "－"}
                        </span>
                        <div className="txn-meta">
                          <span className="txn-name">{labelFor(tx.type, tx.category)}</span>
                          <span className="txn-sub">
                            {tx.type} {tx.description ? ` · ${tx.description}` : ""}
                          </span>
                        </div>
                      </div>
                      <span className={`txn-amount ${tx.type}`}>
                        {tx.type === "income" ? "+" : "-"}
                        {formatMoney(tx.amount).slice(1)}
                      </span>
                      <button
                        className="icon-btn"
                        onClick={() => removeTransaction(tx._id)}
                        aria-label="Delete transaction"
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}