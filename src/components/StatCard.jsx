"use client";

const icons = {
  users: "👥",
  activity: "↔",
  "user-check": "🤝",
  clock: "◷",
};

export default function StatCard({ title, value, change, icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl">
          {icons[icon] || "📊"}
        </span>
      </div>
      <h2 className="mt-4 text-2xl font-bold text-slate-800">{value}</h2>
      <p className="mt-2 text-xs text-slate-500">{change}</p>
    </div>
  );
}
