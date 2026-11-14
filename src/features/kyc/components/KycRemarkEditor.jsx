"use client";

import { useEffect, useState } from "react";
import { updateKycRemark } from "../services/kycService";

export default function KycRemarkEditor({ recordId, remarks }) {
  const initialRemark = remarks ?? "";

  const [savedRemark, setSavedRemark] = useState(initialRemark);
  const [draft, setDraft] = useState(initialRemark);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const nextRemark = remarks ?? "";
    setSavedRemark(nextRemark);
    setDraft(nextRemark);
  }, [remarks]);

  function startEditing() {
    setDraft(savedRemark);
    setError("");
    setEditing(true);
  }

  function cancelEditing() {
    setDraft(savedRemark);
    setError("");
    setEditing(false);
  }

  async function saveRemark() {
    if (draft.length > 100) {
      setError("Remark cannot exceed 100 characters.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const result = await updateKycRemark(recordId, draft);
      const updatedRemark = result?.remarks ?? draft;

      setSavedRemark(updatedRemark);
      setDraft(updatedRemark);
      setEditing(false);
    } catch (err) {
      setError(err?.message || "Unable to save remark. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex min-w-[180px] max-w-[260px] items-start gap-2">
        <span className="min-w-0 flex-1 whitespace-normal break-words text-slate-700">
          {savedRemark || "No remark"}
        </span>

        <button
          type="button"
          onClick={startEditing}
          className="shrink-0 rounded-md border border-blue-200 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
        >
          {savedRemark ? "Edit" : "Add Remark"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-w-[220px] max-w-[280px] flex-col gap-2">
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value.slice(0, 100))}
        maxLength={100}
        rows={3}
        disabled={saving}
        placeholder="Enter remark (maximum 100 characters)"
        className="w-full resize-y rounded-md border border-slate-300 px-2 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100"
      />

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-500">
          {draft.length}/100
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={cancelEditing}
            disabled={saving}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={saveRemark}
            disabled={saving}
            className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}