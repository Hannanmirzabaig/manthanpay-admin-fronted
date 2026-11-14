"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
  { label: "Dashboard", icon: "▦", href: "/dashboard" },
  { label: "Transactions", icon: "⇄", href: "#" },
  { label: "Users", icon: "♙", href: "#" },
  { label: "Agents", icon: "♧", href: "#" },
  { label: "Settlements", icon: "₹", href: "#" },
  { label: "Services", icon: "▣", href: "#" },
  // { label: "Reports", icon: "▤", href: "#" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPath = mounted ? pathname : "";

  const isEsignActive = currentPath.startsWith("/dashboard/aadhaar-esign");

  return (
    <aside className="fixed bottom-0 left-0 top-16 z-[70] hidden w-64 flex-col overflow-visible bg-[#102b50] text-white md:flex">
      <div className="px-5 py-6">
        <p className="mb-4 px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300/80">
          Main Menu
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive =
              currentPath === item.href ||
              (item.href !== "/dashboard" &&
                item.href !== "#" &&
                currentPath.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 font-semibold text-white shadow-lg"
                    : "text-blue-100 hover:bg-white/10 hover:pl-5 hover:text-white"
                }`}
              >
                <span className="flex w-5 items-center justify-center text-lg">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="group/feature relative">
            <button
              type="button"
              aria-haspopup="true"
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-blue-100 transition-colors hover:text-white"
            >
              <span>Feature</span>
              <span className="text-base">›</span>
            </button>

            <div
              className="
                invisible absolute left-full bottom-0 z-[100]
                w-56 rounded-md bg-white p-2 text-slate-800
                opacity-0 shadow-xl translate-x-1
                transition-all duration-150
                group-hover/feature:visible
                group-hover/feature:translate-x-0
                group-hover/feature:opacity-100
                group-focus-within/feature:visible
                group-focus-within/feature:translate-x-0
                group-focus-within/feature:opacity-100
              "
            >
              <Link
                href="/dashboard/aadhaar-esign"
                className={`block px-3 py-2 text-sm transition-colors hover:bg-slate-100 ${
                  isEsignActive ? "text-blue-700" : "text-slate-700"
                }`}
              >
                Document eSign
              </Link>

              <Link
                href="/dashboard/kyc"
                className={`block px-3 py-2 text-sm transition-colors hover:bg-slate-100 ${
                  currentPath.startsWith("/dashboard/kyc")
                    ? "text-blue-700"
                    : "text-slate-700"
                }`}
              >
                KYC
              </Link>
            </div>
          </div>
        </nav>
      </div>

      <div className="mt-auto border-t border-white/10 p-5 text-xs text-blue-200">
        ManthanPay Admin Portal
      </div>
    </aside>
  );
}
