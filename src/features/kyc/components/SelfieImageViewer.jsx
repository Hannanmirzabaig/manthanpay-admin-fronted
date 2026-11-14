"use client";

import { useEffect, useState } from "react";
import { apiBlobRequest } from "@/services/api/apiClient";
import {
  updateKycRemark,
  getKycImageCheckStatus,
  updateKycImageCheckStatus,
} from "../services/kycService";

// Detect PDF or common image formats using MIME type and file signature.
async function detectDocumentType(blob) {
  if (!blob) return "";

  const declaredType = (blob.type || "")
    .split(";")[0]
    .trim()
    .toLowerCase();

  if (
    declaredType === "application/pdf" ||
    declaredType.startsWith("image/")
  ) {
    return declaredType;
  }

  const bytes = new Uint8Array(
    await blob.slice(0, 12).arrayBuffer()
  );

  // PDF: %PDF-
  if (
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2D
  ) {
    return "application/pdf";
  }

  // PNG
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4E &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }

  // JPEG
  if (
    bytes[0] === 0xFF &&
    bytes[1] === 0xD8 &&
    bytes[2] === 0xFF
  ) {
    return "image/jpeg";
  }

  // GIF
  if (
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46
  ) {
    return "image/gif";
  }

  // WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  return "";
}

const statusDocumentNames = {
  "selfie-image": "selfie_image",
  "shop-image": "shop_image",
  poi: "poi",
  poa: "poa",
  poi_back: "poi_back",
  poa_back: "poa_back",
};

const statusFields = {
  "selfie-image": "selfieImage",
  "shop-image": "shopImage",
  poi: "poi",
  poa: "poa",
  poi_back: "poiBack",
  poa_back: "poaBack",
};

const clickableFields = {
  "selfie-image": "selfieClickable",
  "shop-image": "shopImageClickable",
  poi: "poiClickable",
  poi_back: "poiBackClickable",
  poa: "poaClickable",
  poa_back: "poaBackClickable",
};

export default function SelfieImageViewer({
  recordId,
  retailerId,
  endpoint = "selfie-image",
  title = "Selfie Image",
  enableReview = false,
}) {
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [reviewStatus, setReviewStatus] = useState(null);
  const [clickable, setClickable] = useState(false);
  const [savingReview, setSavingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [savingRejection, setSavingRejection] = useState(false);
  const [rejectError, setRejectError] = useState("");

  // Load saved review status and click permission from backend.
  useEffect(() => {
    if (!enableReview || !retailerId) {
      setReviewStatus(null);
      setClickable(false);
      return;
    }

    let active = true;

    async function loadReviewStatus() {
      try {
        const data = await getKycImageCheckStatus(retailerId);

        if (active) {
          const status = data?.[statusFields[endpoint]];

          setReviewStatus(
            status === "VERIFIED"
              ? "verified"
              : status === "REJECTED"
                ? "rejected"
                : null
          );

          setClickable(data?.[clickableFields[endpoint]] === true);
        }
      } catch (error) {
        console.error("Unable to load KYC image status:", error);
        if (active) setClickable(false);
      }
    }

    loadReviewStatus();

    const handleStatusUpdated = () => loadReviewStatus();

    window.addEventListener("kyc-image-status-updated", handleStatusUpdated);

    return () => {
      active = false;
      window.removeEventListener("kyc-image-status-updated", handleStatusUpdated);
    };
  }, [enableReview, retailerId, endpoint]);

  // Revoke image URL when component changes or unmounts.
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  // Save VERIFIED status in MySQL.
  async function handleReview(status) {
    if (!retailerId || !statusDocumentNames[endpoint]) {
      setReviewError("Unable to identify this KYC document.");
      return;
    }

    setSavingReview(true);
    setReviewError("");

    try {
      await updateKycImageCheckStatus(
        retailerId,
        statusDocumentNames[endpoint],
        status === "verified" ? "VERIFIED" : "REJECTED"
      );

      // Update UI only after backend confirms success.
      setReviewStatus(status);
      window.dispatchEvent(new Event("kyc-image-status-updated"));
      handleClose();
    } catch (err) {
      setReviewError(
        err?.message || "Unable to update document status. Please try again."
      );
    } finally {
      setSavingReview(false);
    }
  }

  // Save rejection remark and then REJECTED status.
  async function handleRejectSave() {
    const reason = rejectionReason.trim();

    if (!reason) {
      setRejectError("Please enter a rejection reason.");
      return;
    }

    if (reason.length > 100) {
      setRejectError("Rejection reason cannot exceed 100 characters.");
      return;
    }

    if (!retailerId || !statusDocumentNames[endpoint]) {
      setRejectError("Unable to identify this KYC document.");
      return;
    }

    setSavingRejection(true);
    setRejectError("");

    try {
      // First save the existing KYC remark.
      await updateKycRemark(recordId, reason);

      // Notify other KYC components about the updated remark.
      window.dispatchEvent(
        new CustomEvent("kyc-remark-updated", {
          detail: { recordId, remarks: reason },
        })
      );

      // Then save REJECTED status in MySQL.
      await updateKycImageCheckStatus(
        retailerId,
        statusDocumentNames[endpoint],
        "REJECTED"
      );

      // Update UI only after both API calls succeed.
      setReviewStatus("rejected");
      window.dispatchEvent(new Event("kyc-image-status-updated"));
      handleClose();
    } catch (err) {
      setRejectError(
        err?.message ||
          "Unable to save rejection. Please try again."
      );
    } finally {
      setSavingRejection(false);
    }
  }

  async function handleOpen() {
    setOpen(true);
    setError("");
    setLoading(true);

    if (!recordId) {
      setError("Image not available for this record.");
      setLoading(false);
      return;
    }

    try {
      const blob = await apiBlobRequest(
        `/api/kyc/${encodeURIComponent(recordId)}/${endpoint}`
      );

      const detectedType = await detectDocumentType(blob);

      if (!blob || !detectedType) {
        throw new Error("Unsupported document format");
      }

      setFileType(detectedType);
      const url = URL.createObjectURL(blob);

      setImageUrl((previousUrl) => {
        if (previousUrl) URL.revokeObjectURL(previousUrl);
        return url;
      });
    } catch (err) {
      const status = err?.status ?? err?.response?.status;
      const message = String(err?.message ?? "");

      if (status === 404 || /\b404\b/.test(message)) {
        setError(`${title} not found.`);
      } else if (
        status === 415 ||
        /\b415\b|unsupported media type/i.test(message)
      ) {
        setError("Image not available for this record.");
      } else {
        setError(`Unable to load ${title.toLowerCase()}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setError("");
    setReviewError("");
    setShowRejectReason(false);
    setRejectionReason("");
    setRejectError("");

    setImageUrl((previousUrl) => {
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      return "";
    });
  }

  return (
    <>
      <span className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleOpen}
          disabled={!clickable || loading}
          className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          View
        </button>

        {enableReview && reviewStatus === "rejected" && (
          <span
            title="Rejected"
            aria-label="Rejected"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600"
          >
            ✕
          </span>
        )}

        {enableReview && reviewStatus === "verified" && (
          <span
            title="Verified"
            aria-label="Verified"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600"
          >
            ✓
          </span>
        )}
      </span>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-y-auto rounded-xl bg-white p-2 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-700">
                {title}
              </h2>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="rounded-md px-3 py-1 text-xl text-slate-500 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <div
                  className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
                  role="status"
                  aria-label={`Loading ${title}`}
                />
                <p className="text-sm text-slate-500">
                  Loading {title.toLowerCase()}...
                </p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center gap-2 rounded-lg bg-slate-50 p-8 text-center">
                <span className="text-3xl" aria-hidden="true">📷</span>
                <p className="text-sm font-semibold text-slate-700">
                  {error}
                </p>
              </div>
            )}

            {imageUrl && !loading && !error && (
              <>
                {fileType === "application/pdf" ? (
                  <iframe
                    src={imageUrl}
                    title={title}
                    className="h-[65vh] w-full rounded-lg"
                  />
                ) : (
                  <div className="flex max-h-[50vh] justify-center overflow-auto rounded-lg bg-slate-50 p-2">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="max-h-[50vh] max-w-full object-contain"
                    />
                  </div>
                )}

                {enableReview && (
                  <div className="mt-1 border-t border-slate-200 pt-1">
                    {!showRejectReason ? (
                      <div className="flex justify-center gap-6">
                        <button
                          type="button"
                          disabled={savingReview || savingRejection}
                          onClick={() => handleReview("verified")}
                          className={`rounded-lg border px-6 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            reviewStatus === "verified"
                              ? "border-green-500 bg-green-100 text-green-800"
                              : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {savingReview ? "Saving..." : "✓ Verified"}
                        </button>

                        <button
                          type="button"
                          disabled={savingReview || savingRejection}
                          onClick={() => {
                            setShowRejectReason(true);
                            setRejectError("");
                            setReviewError("");
                          }}
                          className="rounded-lg border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-800">
                          Rejection Reason
                        </label>

                        <textarea
                          value={rejectionReason}
                          onChange={(event) => {
                            setRejectionReason(event.target.value.slice(0, 100));
                            setRejectError("");
                          }}
                          maxLength={100}
                          rows={3}
                          placeholder="Enter reason for rejection..."
                          className="w-full rounded-lg border border-slate-300 p-0 text-sm text-slate-800 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        />

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            {rejectionReason.length}/100 characters
                          </span>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={savingRejection}
                              onClick={() => {
                                setShowRejectReason(false);
                                setRejectionReason("");
                                setRejectError("");
                              }}
                              className="rounded-lg border border-slate-300 px-4 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              disabled={savingRejection || savingReview}
                              onClick={handleRejectSave}
                              className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {savingRejection ? "Saving..." : "OK"}
                            </button>
                          </div>
                        </div>

                        {rejectError && (
                          <p className="text-sm font-medium text-red-600">
                            {rejectError}
                          </p>
                        )}
                      </div>
                    )}

                    {reviewError && (
                      <p className="mt-2 text-center text-sm font-medium text-red-600">
                        {reviewError}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}