"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagerPage() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "manager") {
      // Not logged in or not a manager → redirect to login
      router.push("/auth/login");
    } else {
      // Logged in as manager → redirect to dashboard
      router.push("/manager/dashboard");
    }
  }, []);

  return (
    <div className="p-8">
      <p>Redirecting to manager dashboard...</p>
    </div>
  );
}
