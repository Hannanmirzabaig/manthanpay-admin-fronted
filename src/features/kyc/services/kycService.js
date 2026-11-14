
import { apiRequest } from "@/services/api/apiClient";

export async function getKycRecords() {
  return apiRequest("/api/kyc");
}

export async function getKycRecordById(id) {
  if (!id) {
    throw new Error("KYC record ID is required.");
  }

  return apiRequest(`/api/kyc/${encodeURIComponent(id)}`);
}

export async function updateKycRemark(id, remarks) {
  if (!id) {
    throw new Error("KYC record ID is required.");
  }

  return apiRequest(`/api/kyc/${encodeURIComponent(id)}/remarks`, {
    method: "PUT",
    body: { remarks },
  });
}

// Get KYC image review status from database.
export async function getKycImageCheckStatus(retailerId) {
  if (!retailerId) {
    throw new Error("Retailer ID is required.");
  }

  return apiRequest(
    `/api/kyc/${encodeURIComponent(retailerId)}/image-check-status`
  );
}

// Update KYC image review status in database.
export async function updateKycImageCheckStatus(
  retailerId,
  document,
  status
) {
  if (!retailerId) {
    throw new Error("Retailer ID is required.");
  }

  return apiRequest(
    `/api/kyc/${encodeURIComponent(retailerId)}/image-check-status`,
    {
      method: "PUT",
      body: { document, status },
    }
  );
}
