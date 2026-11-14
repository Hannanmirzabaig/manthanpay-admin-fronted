"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/services/api/apiClient";
import ChangePasswordModal from "@/features/profile/components/ChangePasswordModal";

export default function Topbar() {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "Administrator",
    id: "",
    role: "",
  });

  const [loggingOut, setLoggingOut] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    setUser({
      name: localStorage.getItem("manthanpayLoggedInUser") || "Administrator",
      id: localStorage.getItem("manthanpayUserId") || "",
      role: localStorage.getItem("manthanpayLoggedInRole") || "",
    });
  }, []);

  function openProfile() {
    setIsProfileOpen(false);
    router.push("/profile");
  }

  function openAccountSettings() {
    setIsProfileOpen(false);
    router.push("/account-settings");
  }
  function openChangePassword() {
    setIsProfileOpen(false);
    setIsChangePasswordOpen(true);
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const csrfResponse = await apiRequest("/api/auth/csrf", {
        method: "GET",
      });

      if (!csrfResponse?.token) {
        throw new Error("CSRF token was not received.");
      }

      await apiRequest("/api/auth/logout", {
        method: "POST",
        headers: {
          "X-XSRF-TOKEN": csrfResponse.token,
        },
      });

      localStorage.removeItem("manthanpayAuthToken");
      localStorage.removeItem("manthanpayLoggedInUser");
      localStorage.removeItem("manthanpayLoggedInEmail");
      localStorage.removeItem("manthanpayLoggedInRole");
      localStorage.removeItem("manthanpayUserId");

      router.replace("/login");
    } catch (error) {
      console.error("Backend logout failed:", error);

      window.alert(
        "Backend logout confirm nahi hua. Login data clear nahi kiya gaya. Backend connection check karke dobara try karein."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  const formattedRole =
    user.role === "SUPER_ADMIN"
      ? "Super Admin"
      : user.role === "ADMIN"
        ? "Admin"
        : user.role || "Account";

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center">
        <img
          src="/images/manthanpay-logo.png"
          alt="ManthanPay"
          className="h-11 w-auto max-w-[190px] object-contain"
        />
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-expanded={isProfileOpen}
            className="flex items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-slate-50 sm:gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.7-3.5 3.1-5.3 7-5.3s6.3 1.8 7 5.3" />
              </svg>
            </div>

            <div className="hidden min-w-0 text-left sm:block">
              <p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">
                {user.name}
              </p>
              <p className="text-xs text-slate-500">{formattedRole}</p>
            </div>

            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 text-slate-500 transition-transform ${
                isProfileOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">{formattedRole}</p>
              </div>

              <div className="space-y-1 px-2 py-2">
                <button
                  type="button"
                  onClick={openProfile}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50"
                >
                  <span>👤</span>
                  My Profile
                </button>
                <button
                  type="button"
                  onClick={openChangePassword}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50"
                >
                  <span>🔒</span>
                  Change Password
                </button>

                <button
                  type="button"
                  onClick={openAccountSettings}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-blue-50"
                >
                  <span>⚙️</span>
                  Account Settings
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsLogoutConfirmOpen(true)}
          disabled={loggingOut}
          className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
        >
          <span>{loggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
      {isChangePasswordOpen && (
        <ChangePasswordModal
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}

      {isLogoutConfirmOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            aria-describedby="logout-dialog-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <span className="text-2xl" aria-hidden="true">!</span>
            </div>

            <h2
              id="logout-dialog-title"
              className="text-lg font-semibold text-slate-900"
            >
              Confirm Logout
            </h2>

            <p
              id="logout-dialog-description"
              className="mt-2 text-sm leading-6 text-slate-600"
            >
              Are you sure you want to logout from your ManthanPay account?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsLogoutConfirmOpen(false)}
                disabled={loggingOut}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loggingOut ? "Logging out..." : "Confirm Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}