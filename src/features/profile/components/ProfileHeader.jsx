export default function ProfileHeader({ user, formattedRole }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-700">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c.7-3.5 3.1-5.3 7-5.3s6.3 1.8 7 5.3" />
          </svg>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{formattedRole}</p>
          <p className="mt-1 text-xs text-slate-400">
            User ID: {user.id || "Not available"}
          </p>
        </div>
      </div>
    </div>
  );
}
