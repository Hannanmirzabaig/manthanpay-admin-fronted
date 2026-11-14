import { apiRequest } from "@/services/api/apiClient";

export async function changePassword({
  currentPassword,
  newPassword,
  confirmPassword,
}) {
  return apiRequest("/api/auth/change-password", {
    method: "POST",
    body: {
      currentPassword,
      newPassword,
      confirmPassword,
    },
  });
}