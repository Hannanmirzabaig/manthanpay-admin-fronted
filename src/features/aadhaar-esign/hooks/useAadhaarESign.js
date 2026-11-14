"use client";

import { useState } from "react";
import {
  uploadAadhaarESignPdf,
  getAadhaarESignStatus,
} from "../services/aadhaarESignService";
import { validatePdf } from "../utils/pdfValidator";

export default function useAadhaarESign() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [referenceId, setReferenceId] = useState("");
  const [status, setStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [error, setError] = useState("");

  function selectFile(file) {
    setError("");
    setUploadResponse(null);
    setStatus(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  async function uploadFile() {
    setError("");
    setUploadResponse(null);
    setStatus(null);

    try {
      await validatePdf(selectedFile);

      setUploading(true);

      const response = await uploadAadhaarESignPdf(selectedFile);

      setUploadResponse(response);

      const returnedReferenceId =
        response?.referenceId ||
        response?.data?.referenceId ||
        "";

      if (returnedReferenceId) {
        setReferenceId(String(returnedReferenceId));
      }

      return response;
    } catch (err) {
      setError(err.message || "PDF upload failed.");
      throw err;
    } finally {
      setUploading(false);
    }
  }

  async function checkStatus(value = referenceId) {
    setError("");
    setStatus(null);

    if (!value?.trim()) {
      setError("Please enter a valid Reference ID.");
      return;
    }

    try {
      setCheckingStatus(true);

      const response = await getAadhaarESignStatus(value);

      setStatus(response);

      return response;
    } catch (err) {
      setError(err.message || "Unable to check eSign status.");
      throw err;
    } finally {
      setCheckingStatus(false);
    }
  }

  function reset() {
    setSelectedFile(null);
    setUploadResponse(null);
    setReferenceId("");
    setStatus(null);
    setError("");
  }

  return {
    selectedFile,
    uploading,
    uploadResponse,
    referenceId,
    status,
    checkingStatus,
    error,
    setReferenceId,
    selectFile,
    uploadFile,
    checkStatus,
    reset,
  };
}
