"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Card, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "",        // maps to backend "type"
    pricePerNight: "",   // maps to backend "price"
    status: "Available",
    branchId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // --------------------------
  // Fetch rooms + branches
  // --------------------------
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [roomsRes, branchesRes] = await Promise.all([
        api.get("/rooms"),
        api.get("/branches"),
      ]);

      setRooms(roomsRes.data || roomsRes || []);
      setBranches(branchesRes.data || branchesRes || []);
    } catch (err) {
      console.error("Error fetching rooms/branches:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load rooms or branches from backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --------------------------
  // Form handlers
  // --------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    if (!form.roomNumber || !form.roomType || !form.branchId) {
      alert("Room number, type, and branch are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // IMPORTANT: match backend column names: type, price
      const payload = {
        roomNumber: form.roomNumber,
        type: form.roomType,                                 // ✅ backend expects "type"
        price: Number(form.pricePerNight) || 0,              // ✅ backend expects "price"
        status: form.status,
        branchId: form.branchId,
      };

      await api.post("/rooms", payload);

      // reset form
      setForm({
        roomNumber: "",
        roomType: "",
        pricePerNight: "",
        status: "Available",
        branchId: "",
      });

      await fetchData();
    } catch (err) {
      console.error("Error creating room:", err);
      setError(
        err?.response?.data?.message || "Failed to create room. Check backend."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusVariant = (status = "") => {
    const s = status.toLowerCase();
    if (s.includes("available")) return "success";
    if (s.includes("occupied") || s.includes("booked")) return "warning";
    if (s.includes("maintenance")) return "danger";
    return "default";
  };

  const displayPrice = (room) => {
    // backend uses 'price'; we also support 'pricePerNight' just in case
    if (room.price !== undefined && room.price !== null) return room.price;
    if (room.pricePerNight !== undefined && room.pricePerNight !== null)
      return room.pricePerNight;
    return undefined;
  };

  const displayType = (room) => {
    // backend uses 'type'; we also support 'roomType' just in case
    return room.type || room.roomType || "";
  };

  const displayBranchLabel = (room) => {
    // try various possibilities depending on whether include() is used
    return (
      room.Branch?.name ||
      room.branch?.name ||
      room.branchName ||
      room.branchId ||
      "-"
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Rooms</h2>
          <p className="text-xs text-gray-500">
            Create and manage rooms for each hotel branch.
          </p>
        </div>
        <Button variant="outline" onClick={fetchData}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Create room form */}
      <Card>
        <CardHeader
          title="Create New Room"
          subtitle="Assign the room to a specific branch."
        />
        {branches.length === 0 ? (
          <p className="mt-2 text-xs text-gray-500">
            No branches found. Please create a branch first in{" "}
            <span className="font-semibold">Branches</span> page.
          </p>
        ) : (
          <form
            onSubmit={handleCreateRoom}
            className="mt-2 grid gap-3 md:grid-cols-2"
          >
            <div className="space-y-1 text-xs">
              <label className="font-medium text-gray-700">
                Room Number <span className="text-red-500">*</span>
              </label>
              <input
                name="roomNumber"
                value={form.roomNumber}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                placeholder="101"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-gray-700">
                Room Type <span className="text-red-500">*</span>
              </label>
              <input
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                placeholder="Deluxe / Suite / Standard"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-gray-700">Price / Night</label>
              <input
                name="pricePerNight"
                value={form.pricePerNight}
                onChange={handleChange}
                type="number"
                min="0"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                placeholder="3500"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1 text-xs">
              <label className="font-medium text-gray-700">
                Branch <span className="text-red-500">*</span>
              </label>
              <select
                name="branchId"
                value={form.branchId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select branch</option>
                {branches.map((b) => (
                  <option key={b.id || b._id} value={b.id || b._id}>
                    {b.name} — {b.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Room"}
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Room list */}
      <Card>
        <CardHeader
          title="Existing Rooms"
          subtitle="All rooms configured across branches."
        />
        {loading ? (
          <p className="mt-2 text-xs text-gray-500">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p className="mt-2 text-xs text-gray-500">
            No rooms found. Create a room above.
          </p>
        ) : (
          <div className="mt-2 space-y-2 text-xs">
            {rooms.map((r) => {
              const price = displayPrice(r);
              const type = displayType(r);
              const branchLabel = displayBranchLabel(r);

              return (
                <div
                  key={r.id || r._id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Room {r.roomNumber} {type && <>• {type}</>}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Branch: {branchLabel}
                    </div>
                    {price !== undefined && (
                      <div className="text-[11px] text-gray-400">
                        ₹{price} / night
                      </div>
                    )}
                  </div>
                  <Badge variant={getStatusVariant(r.status)}>
                    {r.status || "Available"}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
