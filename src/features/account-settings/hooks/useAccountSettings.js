"use client";

import { useState } from "react";

const initialSettings = {
  emailNotifications: true,
  securityNotifications: true,
  systemNotifications: false,
  theme: "light",
  compactLayout: false,
  loginAlerts: true,
  language: "en",
  timezone: "Asia/Kolkata",
  currency: "INR"
};

export default function useAccountSettings() {
  const [settings, setSettings] = useState(initialSettings);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value
    }));
  };

  const resetSettings = () => {
    setSettings(initialSettings);
  };

  return {
    settings,
    updateSetting,
    resetSettings
  };
}
