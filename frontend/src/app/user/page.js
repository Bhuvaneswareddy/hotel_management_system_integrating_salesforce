"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "user") {
      router.push("/auth/login");
    } else {
      router.push("/user/dashboard");
    }
  }, []);

  return <p className="p-8">Redirecting to user dashboard...</p>;
}
