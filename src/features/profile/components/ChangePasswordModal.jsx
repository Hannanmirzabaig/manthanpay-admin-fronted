"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "../services/changePasswordService";

const STORAGE_KEYS = [
  "manthanpayAuthToken",
  "manthanpayLoggedInUser",
  "manthanpayLoggedInEmail",
  "manthanpayLoggedInRole",
  "manthanpayUserId",
];

export default function ChangePasswordModal({ onClose }) {
  const router = useRouter();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && !loading && !success) onClose();
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [loading, success, onClose]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    if (form.newPassword !== form.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (form.newPassword === form.currentPassword) {
      setError("New password must be different from current password.");
      return;
    }

    if (form.newPassword.length < 12 || form.newPassword.length > 72) {
      setError("New password must be between 12 and 72 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await changePassword(form);

      // Backend has already revoked all active refresh sessions.
      // Clear local authentication after successful password change.
      STORAGE_KEYS.forEach((key) => {
        localStorage.removeItem(key);
      });

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Unable to change password.");
    } finally {
      setLoading(false);
    }
  }

  function handleLoginRedirect() {
    router.replace("/login");
  }

  const fields = [
    {
      name: "currentPassword",
      label: "Current Password",
      placeholder: "Enter current password",
      autoComplete: "current-password",
    },
    {
      name: "newPassword",
      label: "New Password",
      placeholder: "Enter new password",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword",
      label: "Confirm New Password",
      placeholder: "Confirm new password",
      autoComplete: "new-password",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading && !success) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        {success ? (
          <div className="py-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
              ✓
            </div>

            <h2 id="change-password-title" className="mt-5 text-xl font-bold text-slate-900">
              Password Changed Successfully
            </h2>

            <p className="mt-3 text-sm text-slate-600">
              Your password has been changed successfully.
              Please sign in again using your new password.
            </p>

            <button
              type="button"
              onClick={handleLoginRedirect}
              className="mt-7 w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <h2 id="change-password-title" className="sr-only">Change Password</h2>
            <div className="flex items-start justify-between gap-4">

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                aria-label="Close"
                className="ml-auto text-2xl leading-none text-slate-500 hover:text-slate-800 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className=" space-y-2">
              {fields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type={showPasswords ? "text" : "password"}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    required
                    maxLength={72}
                    minLength={
                      field.name === "newPassword" ||
                      field.name === "confirmPassword"
                        ? 12
                        : undefined
                    }
                    disabled={loading}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                  />
                </div>
              ))}

              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={(event) =>
                    setShowPasswords(event.target.checked)
                  }
                  className="h-4 w-3 accent-blue-500"
                />
                Show password
              </label>

              <p className="text-xs text-slate-500">
                New password must contain between 12 and 72 characters.
              </p>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-slate-200 px-2 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-blue-500 px-1 py-1 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}