"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) || {
        name: "User",
        avatar: "/default-avatar.png",
      };
    setUser(storedUser);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to login page
    router.replace("/auth/login"); // replace prevents back navigation
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/HMS_image.jpg')" }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"></div>

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">User Dashboard</h1>

          {/* User Profile */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-white focus:outline-none"
              >
                <span className="font-medium">{user.name}</span>
                <img
                  src={user.avatar || "/icons/profile.png"}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10">
                  <Link
                    href="/user/dashboard/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/user/dashboard/booking"
            className="flex flex-col items-center justify-center p-6 bg-blue-500 bg-opacity-80 text-white rounded-lg shadow-lg hover:shadow-xl transition hover:-translate-y-1"
          >
            <img src="/icons/booking.png" alt="Booking" className="w-16 h-16 mb-4" />
            <span className="text-lg font-semibold">Room Booking</span>
          </Link>

          <Link
            href="/user/dashboard/food"
            className="flex flex-col items-center justify-center p-6 bg-green-500 bg-opacity-80 text-white rounded-lg shadow-lg hover:shadow-xl transition hover:-translate-y-1"
          >
            <img src="/icons/food.png" alt="Food" className="w-16 h-16 mb-4" />
            <span className="text-lg font-semibold">Food Ordering</span>
          </Link>

          <Link
            href="/user/dashboard/service"
            className="flex flex-col items-center justify-center p-6 bg-yellow-500 bg-opacity-80 text-white rounded-lg shadow-lg hover:shadow-xl transition hover:-translate-y-1"
          >
            <img src="/icons/service.png" alt="Service" className="w-16 h-16 mb-4" />
            <span className="text-lg font-semibold">Service Request</span>
          </Link>

          <Link
            href="/user/dashboard/receipts"
            className="flex flex-col items-center justify-center p-6 bg-purple-500 bg-opacity-80 text-white rounded-lg shadow-lg hover:shadow-xl transition hover:-translate-y-1"
          >
            <img src="/icons/receipt.png" alt="Receipts" className="w-16 h-16 mb-4" />
            <span className="text-lg font-semibold">Payment Receipts</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
