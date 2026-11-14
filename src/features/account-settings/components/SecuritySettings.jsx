import SettingsSection from "./SettingsSection";

export default function SecuritySettings({ settings, updateSetting }) {
  return (
    <SettingsSection
      title="Security Preferences"
      description="Manage your personal security notifications and preferences."
    >
      <label className="flex cursor-pointer items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-800">Login Alerts</p>
          <p className="mt-1 text-sm text-slate-500">
            Receive an alert when your account is accessed.
          </p>
        </div>

        <input
          type="checkbox"
          checked={settings.loginAlerts}
          onChange={(e) => updateSetting("loginAlerts", e.target.checked)}
          className="h-4 w-4 accent-blue-600"
        />
      </label>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-medium text-blue-900">
          Two-Factor Authentication
        </p>
        <p className="mt-1 text-sm text-blue-800">
          Your organization's 2FA policy is managed by the Super Admin.
          Its actual status will be loaded from the backend.
        </p>
      </div>
      {/* Change Password is managed centrally through the Topbar.
      <button
        type="button"
        disabled
        className="cursor-not-allowed rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-400"
      >
        Change Password - Coming Soon
      </button>
      */}
    </SettingsSection>
  );
}