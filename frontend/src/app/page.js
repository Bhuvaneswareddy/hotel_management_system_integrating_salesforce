"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/ui/Button";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      {/* Greeting */}
      <h1 className="text-3xl font-bold text-gray-900">
        👋 Welcome to <span className="text-blue-600">Hotel Management System</span>
      </h1>

      {/* Description */}
      <p className="mt-3 max-w-md text-sm text-gray-600">
        A modern multi-branch hotel platform integrated with Salesforce. 
        Manage bookings, rooms, branches, staff and customer experience from an easy dashboard.
      </p>

      {/* Login Buttons */}
      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <Button
          onClick={() => router.push("/auth/login?role=admin")}
          className="w-48"
        >
          Login as Admin
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push("/auth/login")}
          className="w-48"
        >
          Login as User
        </Button>
      </div>

      {/* Footer */}
      <p className="mt-10 text-xs text-gray-400">
        Built with Next.js, TailwindCSS & Salesforce Integration
      </p>
    </div>
  );
}
