"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      // Not logged in or not admin → redirect to login
      router.push("/auth/login");
    } else {
      // Logged in as admin → redirect to dashboard
      router.push("/admin/dashboard");
    }
  }, []);

  return (
    <div className="p-8">
      <p>Redirecting to admin dashboard...</p>
    </div>
  );
}
