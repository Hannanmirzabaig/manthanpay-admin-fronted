import { apiRequest } from "@/services/api/apiClient";

export async function uploadAadhaarESignPdf(file) {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/api/kyc/aadhaar-esign/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getAadhaarESignStatus(referenceId) {
  if (!referenceId || !referenceId.trim()) {
    throw new Error("Reference ID is required.");
  }

  return apiRequest(
    `/api/kyc/aadhaar-esign/status?referenceId=${encodeURIComponent(referenceId.trim())}`,
    {
      method: "GET",
    }
  );
}
