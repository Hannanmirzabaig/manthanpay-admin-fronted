"use client";

import { useMemo, useState } from "react";
import { useKycRecords } from "../hooks/useKyc";
import KycTable from "./KycTable";

export default function KycList() {
  const { records, loading, error, reload } = useKycRecords();
  const [search, setSearch] = useState("");

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return records;

    return records.filter((record) =>
      [
        record.retailerId,
        record.retailerName,
        record.mobileNo,
        record.panNo,
      ].some((value) => String(value ?? "").toLowerCase().includes(query))
    );
  }, [records, search]);

  return (
    <section className="w-full min-w-0 space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          KYC Management
        </h1>
        {/* <p className="mt-1 text-sm text-slate-500">
          View and search retailer KYC records.
        </p> */}
      </div>

      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Retailer ID, Name, Mobile, PAN..."
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="button"
          onClick={reload}
          disabled={loading}
          className="h-11 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="text-sm font-semibold text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white px-5 py-14 text-center text-sm text-slate-500">
          Loading KYC records...
        </div>
      ) : !error ? (
        <>
          <div className="text-sm text-slate-500">
            {search.trim()
              ? `${filteredRecords.length} matching records`
              : `${records.length} records`}
          </div>
          <KycTable records={filteredRecords} />
        </>
      ) : null}
    </section>
  );
}
