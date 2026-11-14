import SettingsSection from "./SettingsSection";

export default function RegionalSettings({ settings, updateSetting }) {
  return (
    <SettingsSection
      title="Regional Settings"
      description="Choose your preferred language, timezone and currency display."
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Language
        </label>
        <select
          value={settings.language}
          onChange={(e) => updateSetting("language", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Timezone
        </label>
        <select
          value={settings.timezone}
          onChange={(e) => updateSetting("timezone", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="Asia/Kolkata">India Standard Time (IST)</option>
          <option value="UTC">Coordinated Universal Time (UTC)</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Currency Display
        </label>
        <select
          value={settings.currency}
          onChange={(e) => updateSetting("currency", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="INR">Indian Rupee (INR)</option>
          <option value="USD">US Dollar (USD)</option>
        </select>
      </div>
    </SettingsSection>
  );
}
