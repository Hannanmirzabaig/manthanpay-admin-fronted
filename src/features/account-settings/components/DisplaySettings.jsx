import SettingsSection from "./SettingsSection";

export default function DisplaySettings({ settings, updateSetting }) {
  return (
    <SettingsSection
      title="Display Preferences"
      description="Customize how the admin panel appears on your screen."
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Theme
        </label>
        <select
          value={settings.theme}
          onChange={(e) => updateSetting("theme", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System Default</option>
        </select>
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-800">Compact Layout</p>
          <p className="mt-1 text-sm text-slate-500">Use a more compact interface.</p>
        </div>
        <input
          type="checkbox"
          checked={settings.compactLayout}
          onChange={(e) => updateSetting("compactLayout", e.target.checked)}
          className="h-4 w-4 accent-blue-600"
        />
      </label>
    </SettingsSection>
  );
}
