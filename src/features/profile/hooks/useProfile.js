"use client";

import { useEffect, useState } from "react";
import {
  getCurrentProfile,
  formatProfileRole,
} from "../services/profileService";

export default function useProfile() {
  const [user, setUser] = useState({
    name: "Administrator",
    id: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    setUser(getCurrentProfile());
  }, []);

  return {
    user,
    formattedRole: formatProfileRole(user.role),
  };
}
