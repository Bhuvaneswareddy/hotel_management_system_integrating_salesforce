"use client";

import { usePathname, useRouter } from "next/navigation";

const titleMap = {
  "/admin/dashboard": "Dashboard",
  "/admin/bookings": "Bookings",
  "/admin/rooms": "Rooms",
  "/admin/food": "Food Menu",
  "/admin/branches": "Branches",
  "/admin/salesforce": "Salesforce Sync",
};

export default function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const title = titleMap[pathname] || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur">
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <p className="text-xs text-gray-500">
          {title === "Dashboard"
            ? "Overview of branches, occupancy, and revenue."
            : `Manage ${title.toLowerCase()} in your system.`}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        >
          Go to Website
        </button>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
