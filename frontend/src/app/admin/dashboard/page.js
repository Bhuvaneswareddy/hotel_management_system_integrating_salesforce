"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Card, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError("");

        const [bookingsRes, roomsRes, branchesRes, foodRes] =
          await Promise.all([
            api.get("/bookings"),
            api.get("/rooms"),
            api.get("/branches"),
            api.get("/food"),
          ]);

        setBookings(bookingsRes.data || bookingsRes || []);
        setRooms(roomsRes.data || roomsRes || []);
        setBranches(branchesRes.data || branchesRes || []);
        setFoodItems(foodRes.data || foodRes || []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Failed to load admin data. Is backend running?"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ---- Derived stats ----
  const totalBookings = bookings.length;
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(
    (room) => room.status === "Available"
  ).length;
  const totalBranches = branches.length;
  const totalFoodItems = foodItems.length;

  const today = new Date().toISOString().slice(0, 10);
  const todaysCheckins = bookings.filter(
    (b) => b.checkIn && b.checkIn.startsWith(today)
  ).length;

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const getStatusVariant = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("cancel")) return "danger";
    if (s.includes("check")) return "success";
    if (s.includes("pending")) return "warning";
    return "info";
  };

  return (
    <div className="space-y-6">
      {/* Top actions */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs text-gray-500">
            Multi-branch hotel overview •{" "}
            <span className="font-medium text-gray-700">
              {new Date().toLocaleString()}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
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

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader
            title="Total Bookings"
            subtitle="All-time across branches"
          />
          <p className="text-2xl font-semibold text-gray-900">
            {loading ? "-" : totalBookings}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {todaysCheckins} check-in(s) today
          </p>
        </Card>

        <Card>
          <CardHeader
            title="Rooms"
            subtitle="Available vs total rooms"
          />
          <p className="text-2xl font-semibold text-gray-900">
            {loading ? "-" : `${availableRooms}/${totalRooms}`}
          </p>
          <p className="mt-1 text-xs text-gray-500">Available / Total</p>
        </Card>

        <Card>
          <CardHeader
            title="Branches"
            subtitle="Active hotel locations"
          />
          <p className="text-2xl font-semibold text-gray-900">
            {loading ? "-" : totalBranches}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Manage city-wise performance
          </p>
        </Card>

        <Card>
          <CardHeader
            title="Menu Items"
            subtitle="Food & beverages configured"
          />
          <p className="text-2xl font-semibold text-gray-900">
            {loading ? "-" : totalFoodItems}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Synced with room service billing
          </p>
        </Card>
      </div>

      {/* Branch snapshot + recent bookings */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader
            title="Branch Snapshot"
            subtitle="Quick view of configured branches"
          />
          {branches.length === 0 && !loading && (
            <p className="text-xs text-gray-500">
              No branches found. Add branches from the admin panel.
            </p>
          )}
          <ul className="mt-2 space-y-2 text-sm">
            {branches.slice(0, 5).map((branch) => (
              <li
                key={branch.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {branch.name}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {branch.city}, {branch.state}
                  </p>
                </div>
                <Badge variant="default">ID: {branch.id}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Recent Bookings"
            subtitle="Last 5 bookings across all branches"
          />
          {recentBookings.length === 0 && !loading && (
            <p className="text-xs text-gray-500">
              No bookings found. They will appear here once created.
            </p>
          )}
          <div className="mt-2 space-y-2 text-xs">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="flex justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    #{b.id} • {b.customerName}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Branch: {b.branchId} • Room: {b.roomId}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {b.checkIn} → {b.checkOut}
                  </p>
                </div>
                <Badge variant={getStatusVariant(b.status)}>
                  {b.status || "Booked"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
