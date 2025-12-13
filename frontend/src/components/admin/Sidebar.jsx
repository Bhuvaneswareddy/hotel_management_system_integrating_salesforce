"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Bookings", href: "/admin/bookings" },
  { label: "Rooms", href: "/admin/rooms" },
  { label: "Food Menu", href: "/admin/food" },
  { label: "Branches", href: "/admin/branches" },
  { label: "Salesforce Sync", href: "/admin/salesforce" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 flex-col border-r border-gray-200 bg-white">
      <div className="px-6 py-5 border-b border-gray-200">
        <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase">
          Hotel Management
        </p>
        <h1 className="mt-1 text-lg font-semibold text-gray-900">
          Admin Console
        </h1>
        <p className="mt-1 text-xs text-gray-500">
          Monitor bookings, rooms & Salesforce sync.
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition " +
                (isActive
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900")
              }
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mr-2" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 text-xs text-gray-500">
        © {new Date().getFullYear()} Your Hotel Brand
      </div>
    </aside>
  );
}
