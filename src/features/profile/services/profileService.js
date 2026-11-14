const STORAGE_KEYS = {
  name: "manthanpayLoggedInUser",
  id: "manthanpayUserId",
  email: "manthanpayLoggedInEmail",
  role: "manthanpayLoggedInRole",
};

export function getCurrentProfile() {
  if (typeof window === "undefined") {
    return {
      name: "Administrator",
      id: "",
      email: "",
      role: "",
    };
  }

  return {
    name: localStorage.getItem(STORAGE_KEYS.name) || "Administrator",
    id: localStorage.getItem(STORAGE_KEYS.id) || "",
    email: localStorage.getItem(STORAGE_KEYS.email) || "",
    role: localStorage.getItem(STORAGE_KEYS.role) || "",
  };
}

export function formatProfileRole(role) {
  if (role === "SUPER_ADMIN") return "Super Admin";
  if (role === "ADMIN") return "Admin";
  return role || "Not available";
}
