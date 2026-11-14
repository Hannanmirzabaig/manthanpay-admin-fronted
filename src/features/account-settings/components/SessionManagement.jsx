import SettingsSection from "./SettingsSection";

export default function SessionManagement() {
  return (
    <SettingsSection
      title="Session Management"
      description="Review and manage your account sessions."
    >
      <div className="rounded-lg border border-slate-200 p-4">
        <p className="text-sm font-medium text-slate-800">
          Current Session
        </p>
        <p className="mt-1 text-xs text-slate-500">
          This device - Session details pending backend integration
        </p>

        <span className="mt-4 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          Current session
        </span>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-900">
          Active session listing and remote logout will be enabled after secure
          backend session-management APIs are implemented.
        </p>
      </div>

      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-400"
      >
        Sign Out Other Sessions - Coming Soon
      </button>
    </SettingsSection>
  );
}