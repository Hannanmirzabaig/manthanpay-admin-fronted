"use client";

import { useRef, useState } from "react";
import useAadhaarESign from "../hooks/useAadhaarESign";
import { formatFileSize } from "../utils/pdfValidator";

export default function AadhaarESignUpload() {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const {
    selectedFile,
    uploading,
    uploadResponse,
    referenceId,
    error,
    selectFile,
    uploadFile,
    reset,
  } = useAadhaarESign();

  function handleFile(file) {
    selectFile(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  }

  async function handleUpload() {
    try {
      const response = await uploadFile();

      if (response?.success === true) {
        selectFile(null);
        setShowSuccessModal(true);
      }
    } catch {
      // Error is displayed by the hook.
    }
  }

  function handleReset() {
    reset();
    setShowSuccessModal(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Aadhaar eSign
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload your PDF document for Aadhaar eSign processing.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Upload PDF Document
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Only PDF files up to 5 MB are allowed.
          </p>
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition ${
            dragging
              ? "border-blue-500 bg-blue-50"
              : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50"
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-700">
            ↑
          </div>

          <p className="mt-4 font-semibold text-slate-700">
            Drag and drop your PDF here
          </p>

          <p className="mt-1 text-sm text-slate-500">
            or click to browse files
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(event) => {
              handleFile(event.target.files?.[0] || null);
              event.target.value = "";
            }}
          />
        </div>

        {selectedFile && (
          <div className="mt-5 flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-sm font-bold text-red-600">
                PDF
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-700">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={uploading}
              onClick={() => selectFile(null)}
              className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              Remove file
            </button>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {uploadResponse && (
          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="font-semibold text-green-800">
              Upload request completed.
            </p>
            {referenceId && (
              <p className="mt-2 break-all text-sm text-green-700">
                Reference ID: {referenceId}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!selectedFile || uploading}
            onClick={handleUpload}
            className="rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>

          <button
            type="button"
            disabled={uploading}
            onClick={handleReset}
            className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>

      <p className="text-xs leading-5 text-slate-500">
        Security note: The PDF is sent to the ManthanPay backend and saved
        in server-side local storage for temporary testing.
      </p>

      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upload-success-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-10 w-10 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
            </div>

            <h2
              id="upload-success-title"
              className="mt-5 text-2xl font-bold text-slate-800"
            >
              PDF Successfully Uploaded!
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your PDF document has been uploaded successfully.
            </p>

            <button
              type="button"
              autoFocus
              onClick={() => setShowSuccessModal(false)}
              className="mt-7 w-full rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}