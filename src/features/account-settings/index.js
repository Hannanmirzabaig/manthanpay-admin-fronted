"use client";

import useAccountSettings from "./hooks/useAccountSettings";
import NotificationSettings from "./components/NotificationSettings";
import DisplaySettings from "./components/DisplaySettings";
import SecuritySettings from "./components/SecuritySettings";
import RegionalSettings from "./components/RegionalSettings";
import SessionManagement from "./components/SessionManagement";

export default function AccountSettingsFeature() {
  const { settings, updateSetting, resetSettings } = useAccountSettings();

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal preferences and account settings.
        </p>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm text-amber-900">
          Settings are currently a frontend preview. Changes are temporary and
          reset when the page is refreshed. Secure backend persistence is not
          connected yet.
        </p>
      </div>

      <NotificationSettings settings={settings} updateSetting={updateSetting} />
      <DisplaySettings settings={settings} updateSetting={updateSetting} />
      <SecuritySettings settings={settings} updateSetting={updateSetting} />
      <RegionalSettings settings={settings} updateSetting={updateSetting} />
      <SessionManagement />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={resetSettings}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Reset Preferences
        </button>
      </div>
    </div>
  );
}
