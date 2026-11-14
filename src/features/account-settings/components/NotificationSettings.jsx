import SettingsSection from "./SettingsSection";

export default function NotificationSettings({ settings, updateSetting }) {
  return (
    <SettingsSection
      title="Notification Preferences"
      description="Manage how you receive account and system notifications."
    >
      {[
        ["emailNotifications", "Email Notifications", "Receive important updates through email."],
        ["securityNotifications", "Security Alerts", "Get notified about important security events."],
        ["systemNotifications", "System Notifications", "Receive platform announcements and updates."]
      ].map(([key, title, description]) => (
        <label key={key} className="flex cursor-pointer items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-800">{title}</p>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
          <input
            type="checkbox"
            checked={settings[key]}
            onChange={(e) => updateSetting(key, e.target.checked)}
            className="h-4 w-4 accent-blue-600"
          />
        </label>
      ))}
    </SettingsSection>
  );
}
