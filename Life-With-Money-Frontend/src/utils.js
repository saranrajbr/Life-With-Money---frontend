import { useCallback, useEffect, useState } from "react";
import API from "./api";

export const RANGES = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
  { key: "all", label: "All" }
];

export function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export function formatMoney(amount, currency = "₹") {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${currency}0`;
  return `${currency}${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

export function formatCompact(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "0";
  if (Math.abs(n) >= 1_00_00_000) return (n / 1_00_00_000).toFixed(1) + "Cr";
  if (Math.abs(n) >= 1_00_000) return (n / 1_00_000).toFixed(1) + "L";
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

// Loads the category taxonomy once and keeps it in sync.
export function useCategories() {
  const [categories, setCategories] = useState({ income: [], expense: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    API.get("/transactions/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setError("Could not load categories"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const labelFor = useCallback(
    (type, key) => {
      const list = (type === "expense" ? categories.expense : categories.income) || [];
      return list.find((c) => c.key === key)?.label || key;
    },
    [categories]
  );

  return { categories, loading, error, refresh: load, labelFor };
}

export function groupTransactionsByDate(transactions) {
  const map = new Map();
  transactions.forEach((tx) => {
    const key = tx.dateStr || tx.date?.slice?.(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(tx);
  });
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
}