"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api"; // same depth as dashboard
import { Card, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/bookings"); // change if your backend uses /api/bookings
        const data = res.data || res || [];
        setBookings(data);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Failed to load bookings. Is backend running?"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusVariant = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("cancel")) return "danger";
    if (s.includes("check")) return "success";
    if (s.includes("pending")) return "warning";
    return "info";
  };

  const filtered = bookings.filter((b) => {
    if (statusFilter === "all") return true;
    if (!b.status) return false;
    return b.status.toLowerCase().includes(statusFilter);
  });

  return (
    <div className="space-y-4">
      {/* Header + actions */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Bookings</h2>
          <p className="text-xs text-gray-500">
            View, filter and manage all hotel bookings.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
          <Button>New Booking</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader
          title="All Bookings"
          subtitle="Filter by status, branch, or date."
        />

        {/* Filters */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-gray-500">Status:</span>
            {[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "check-in", label: "Checked-in" },
              { id: "check-out", label: "Checked-out" },
              { id: "cancel", label: "Cancelled" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setStatusFilter(opt.id)}
                className={`rounded-full border px-2 py-0.5 text-[11px] ${
                  statusFilter === opt.id
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filtered.length}
            </span>{" "}
            of {bookings.length} bookings
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-1 text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-gray-500">
                <th className="px-3 py-2">Booking ID</th>
                <th className="px-3 py-2">Guest</th>
                <th className="px-3 py-2">Branch</th>
                <th className="px-3 py-2">Room</th>
                <th className="px-3 py-2">Check-in</th>
                <th className="px-3 py-2">Check-out</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-6 text-center text-xs text-gray-500"
                  >
                    Loading bookings...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-6 text-center text-xs text-gray-500"
                  >
                    No bookings found for selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr
                    key={b.id || b._id}
                    className="bg-white shadow-sm rounded-lg"
                  >
                    <td className="rounded-l-lg px-3 py-2 align-top font-medium text-gray-900">
                      #{b.id || b._id}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="font-medium text-gray-900">
                        {b.customerName || b.guestName || "Guest"}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {b.customerEmail || b.email || "-"}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top text-gray-700">
                      {b.branchName || b.branchId || "-"}
                    </td>
                    <td className="px-3 py-2 align-top text-gray-700">
                      {b.roomNumber || b.roomId || "-"}
                    </td>
                    <td className="px-3 py-2 align-top text-gray-700">
                      {b.checkIn || b.checkInDate || "-"}
                    </td>
                    <td className="px-3 py-2 align-top text-gray-700">
                      {b.checkOut || b.checkOutDate || "-"}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <Badge variant={getStatusVariant(b.status)}>
                        {b.status || "Booked"}
                      </Badge>
                    </td>
                    <td className="rounded-r-lg px-3 py-2 align-top text-right">
                      <Button variant="ghost" className="mr-1">
                        View
                      </Button>
                      <Button variant="outline" className="mr-1">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
