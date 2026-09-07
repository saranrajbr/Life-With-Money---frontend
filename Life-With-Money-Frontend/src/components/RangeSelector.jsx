import { RANGES } from "../utils";

export default function RangeSelector({ value, onChange }) {
  return (
    <div className="range-toggle">
      {RANGES.map((r) => (
        <button
          key={r.key}
          className={value === r.key ? "active" : ""}
          onClick={() => onChange(r.key)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}