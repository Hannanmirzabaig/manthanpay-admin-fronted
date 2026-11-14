export function maskAadhaar(value) {
  if (!value) return "—";
  const digits = String(value).replace(/\D/g, "");
  if (digits.length < 4) return "XXXX";
return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function maskBankAccount(value) {
  if (!value) return "—";
  // const account = String(value).replace(/\s/g, "");
  // if (account.length <= 4) return "X".repeat(account.length);
  // return `${"X".repeat(account.length - 4)}${account.slice(-4)}`;
  return String(value);
}

export function maskPan(value) {
  if (!value) return "—";
  // const pan = String(value);
  // if (pan.length <= 4) return "XXXX";
  // return `${pan.slice(0, 2)}XXXXX${pan.slice(-2)}`;
  return String(value);
}

export function maskMobile(value) {
  if (!value) return "—";
  // const mobile = String(value);
  // if (mobile.length <= 4) return "X".repeat(mobile.length);
  // return `${"X".repeat(mobile.length - 4)}${mobile.slice(-4)}`;
  return String(value);
}

export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function displayValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return "—";
  return String(value);
}
