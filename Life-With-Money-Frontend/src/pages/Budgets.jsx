import { useState, useEffect, useMemo } from "react";
import AppLayout from "../components/AppLayout";
import RangeSelector from "../components/RangeSelector";
import Portfolio from "../components/Portfolio";
import Spinner from "../components/Spinner";
import { useToast } from "../components/toastContext";
import API from "../api";
import { useCategories, formatMoney, formatCompact, todayStr } from "../utils";

const COLORS = [
  "#d4af37", "#ff6b6b", "#4ecdc4", "#6c5ce7", "#00b894",
  "#e17055", "#0984e3", "#fdcb6e", "#00cec9", "#fd79a8",
  "#e84393", "#636e72"
];

export default function Budgets() {
  const [range, setRange] = useState("month");
  const [data, setData] = useState(null);
  const [salary, setSalary] = useState(0);
  const [loading, setLoading] = useState(true);
  const { labelFor } = useCategories();
  const toast = useToast();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [userRes, txRes] = await Promise.all([
          API.get("/auth/me"),
          API.get(`/transactions?range=${range}&dateStr=${todayStr()}`)
        ]);
        setSalary(userRes.data.salary || 0);
        setData(txRes.data);
      } catch {
        toast("Could not load overview.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [range]); // eslint-disable-line react-hooks/exhaustive-deps

  const summary = data?.summary || { totalIncome: 0, totalExpense: 0, net: 0 };
  const totalExpense = summary.totalExpense || 0;

  const breakdown = useMemo(() => {
    const catBreakdown = data?.categories?.expense || {};
    return Object.entries(catBreakdown)
      .map(([cat, amount]) => ({
        category: cat,
        amount,
        pct: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [data, totalExpense]);

  const spendPct = salary > 0 ? (totalExpense / salary) * 100 : 0;

  if (loading && !data) {
    return (
      <AppLayout>
        <div className="page centered"><Spinner size={26} /> Loading overview…</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page">
        <header className="page-head">
          <div>
            <h1>Financial Overview</h1>
            <p className="page-head-sub">Track your money. Control your life.</p>
          </div>
          <RangeSelector value={range} onChange={setRange} />
        </header>

        <div className="ov-stats">
          <div className="stat-card">
            <span className="stat-label">Salary</span>
            <span className="stat-value gold">{formatMoney(salary)}</span>
            <div className="bar">
              <div className="bar-fill gold" style={{ width: "100%" }} />
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Income</span>
            <span className="stat-value inc">{formatMoney(summary.totalIncome)}</span>
            <div className="bar">
              <div className="bar-fill inc" style={{ width: "100%" }} />
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Spent</span>
            <span className="stat-value exp">{formatMoney(totalExpense)}</span>
            <div className="bar">
              <div className="bar-fill exp" style={{ width: `${Math.min(spendPct, 100)}%` }} />
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Net Saved</span>
            <span className={`stat-value ${summary.net >= 0 ? "inc" : "exp"}`}>
              {formatMoney(summary.net)}
            </span>
            <div className="bar">
              <div
                className="bar-fill"
                style={{ width: "100%", background: summary.net >= 0 ? "var(--inc)" : "var(--exp)" }}
              />
            </div>
          </div>
        </div>

        <div className="ov-grid">
          <section className="card">
            <div className="card-head">
              <h2>Spending by Category</h2>
              <span className="card-head-sub">{range}</span>
            </div>
            {breakdown.length === 0 ? (
              <p className="empty-note">No expenses in this period.</p>
            ) : (
              <div className="cat-bars">
                {breakdown.map((b, i) => (
                  <div className="cat-row" key={b.category}>
                    <div className="cat-row-top">
                      <span className="cat-dot" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="cat-name">{labelFor("expense", b.category)}</span>
                      <span className="cat-amount">
                        {formatCompact(b.amount)}
                        <small> · {b.pct.toFixed(0)}%</small>
                      </span>
                    </div>
                    <div className="cat-track">
                      <div className="cat-fill" style={{ width: `${b.pct}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <Portfolio />
        </div>
      </div>
    </AppLayout>
  );
}