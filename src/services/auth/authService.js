import { apiRequest } from "@/services/api/apiClient";

export function loginAdmin(options) {
  return apiRequest("/api/auth/login", options);
}

export function verifyLoginOtp(options) {
  return apiRequest("/api/auth/verify-login-otp", options);
}

export function resendLoginOtp(options) {
  return apiRequest("/api/auth/resend-login-otp", options);
}

export function requestPasswordReset(options) {
  return apiRequest("/api/auth/forgot-password", options);
}
