"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../services/api";
import { v4 as uuidv4 } from "uuid";

export default function BookingPage() {
  const router = useRouter();

  const [branches, setBranches] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [form, setForm] = useState({
    customerName: "",
    branchId: "",
    roomType: "",
    roomId: "",
    checkIn: "",
    checkOut: "",
    roomPrice: 0,
    totalAmount: 0,
  });

  const [loading, setLoading] = useState({
    branches: false,
    types: false,
    rooms: false,
    submit: false,
  });
  const [message, setMessage] = useState("");

  // --- Fetch branches once ---
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading((s) => ({ ...s, branches: true }));
        const res = await api.get("/branches");
        setBranches(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch branches:", err);
      } finally {
        setLoading((s) => ({ ...s, branches: false }));
      }
    };
    fetchBranches();
  }, []);

  // --- Fetch room types after branch + dates chosen ---
  useEffect(() => {
    const { branchId, checkIn, checkOut } = form;
    if (!branchId || !checkIn || !checkOut) {
      setRoomTypes([]);
      setForm((p) => ({ ...p, roomType: "", roomId: "", roomPrice: 0 }));
      return;
    }

    const fetchRoomTypes = async () => {
      try {
        setLoading((s) => ({ ...s, types: true }));
        // backend endpoint existed as /rooms/types/:branchId
        // include dates as query params if backend supports it
        const res = await api.get(`/rooms/types/${branchId}`, {
          params: { checkIn, checkOut },
        });
        setRoomTypes(res?.data || []);
        setForm((p) => ({ ...p, roomType: "", roomId: "", roomPrice: 0 }));
      } catch (err) {
        console.error("Failed to fetch room types:", err);
        setRoomTypes([]);
      } finally {
        setLoading((s) => ({ ...s, types: false }));
      }
    };

    fetchRoomTypes();
  }, [form.branchId, form.checkIn, form.checkOut]);

  // --- Fetch available rooms after branch + dates + roomType chosen ---
  useEffect(() => {
    const { branchId, roomType, checkIn, checkOut } = form;
    if (!branchId || !roomType || !checkIn || !checkOut) {
      setRooms([]);
      setForm((p) => ({ ...p, roomId: "", roomPrice: 0 }));
      return;
    }

    const fetchAvailableRooms = async () => {
      try {
        setLoading((s) => ({ ...s, rooms: true }));
        const res = await api.get("/rooms/available", {
          params: {
            branchId,
            type: roomType,
            checkIn,
            checkOut,
          },
        });
        setRooms(res?.data || []);
        setForm((p) => ({ ...p, roomId: "", roomPrice: 0 }));
      } catch (err) {
        console.error("Failed to fetch available rooms:", err);
        setRooms([]);
      } finally {
        setLoading((s) => ({ ...s, rooms: false }));
      }
    };

    fetchAvailableRooms();
  }, [form.branchId, form.roomType, form.checkIn, form.checkOut]);

  // --- compute nights between dates ---
  const nights = useMemo(() => {
    const { checkIn, checkOut } = form;
    if (!checkIn || !checkOut) return 0;
    const diff = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.ceil(diff) : 0;
  }, [form.checkIn, form.checkOut]);

  // --- update totalAmount when nights or roomPrice change ---
  useEffect(() => {
    setForm((p) => ({ ...p, totalAmount: nights * (p.roomPrice || 0) }));
  }, [nights, form.roomPrice]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If selecting a branch or dates, clear downstream selects
    if (name === "branchId") {
      setForm((p) => ({
        ...p,
        branchId: value,
        roomType: "",
        roomId: "",
        roomPrice: 0,
        totalAmount: 0,
      }));
      setRoomTypes([]);
      setRooms([]);
      return;
    }

    if (name === "checkIn" || name === "checkOut") {
      setForm((p) => ({
        ...p,
        [name]: value,
        roomType: "",
        roomId: "",
        roomPrice: 0,
        totalAmount: 0,
      }));
      setRoomTypes([]);
      setRooms([]);
      return;
    }

    if (name === "roomType") {
      setForm((p) => ({
        ...p,
        roomType: value,
        roomId: "",
        roomPrice: 0,
        totalAmount: 0,
      }));
      setRooms([]);
      return;
    }

    if (name === "roomId") {
      const selected = rooms.find((r) => String(r.id) === String(value));
      const price = selected ? selected.price : 0;
      setForm((p) => ({ ...p, roomId: value, roomPrice: price, totalAmount: nights * price }));
      return;
    }

    // default
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !form.customerName ||
      !form.branchId ||
      !form.checkIn ||
      !form.checkOut ||
      !form.roomType ||
      !form.roomId
    ) {
      setMessage("Please fill all required fields (branch, dates, room type and room).");
      return;
    }

    if (nights <= 0) {
      setMessage("Check-out date must be after check-in date.");
      return;
    }

    const bookingData = {
      customerName: form.customerName,
      branchId: parseInt(form.branchId),
      roomId: parseInt(form.roomId),
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      roomPrice: form.roomPrice,
      totalAmount: form.totalAmount,
      nights,
    };

    const bookingId = uuidv4();

    // push to payment page (keeping same encoded query approach)
    router.push(
      `/user/dashboard/booking/payment/${bookingId}?bookingData=${encodeURIComponent(
        JSON.stringify(bookingData)
      )}`
    );
  };

  return (
    <div className="min-h-[70vh] flex items-start justify-center py-10 px-4 bg-gray-50">
      <div className="w-full max-w-2xl space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Book a Room</h1>
          <p className="mt-1 text-sm text-gray-500">
            Choose branch and dates first — then pick a room type and room number.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-xl bg-white p-6 shadow-sm">
          {/* Customer name */}
          <div>
            <label className="block text-xs font-medium text-gray-700">Guest name</label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Branch + dates row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700">Branch</label>
              <select
                name="branchId"
                value={form.branchId}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">{loading.branches ? "Loading..." : "Select branch"}</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} — {b.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Check-in</label>
              <input
                name="checkIn"
                type="date"
                value={form.checkIn}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Check-out</label>
              <input
                name="checkOut"
                type="date"
                value={form.checkOut}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Room type (shows only after branch + dates) */}
          <div>
            <label className="block text-xs font-medium text-gray-700">Room type</label>
            <select
              name="roomType"
              value={form.roomType}
              onChange={handleChange}
              disabled={!form.branchId || !form.checkIn || !form.checkOut || loading.types}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
            >
              <option value="">{loading.types ? "Loading types..." : "Select room type"}</option>
              {roomTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[12px] text-gray-400">Room types are fetched for the selected branch and dates.</p>
          </div>

          {/* Room number (shows only after type + dates) */}
          <div>
            <label className="block text-xs font-medium text-gray-700">Room number</label>
            <select
              name="roomId"
              value={form.roomId}
              onChange={handleChange}
              disabled={!form.roomType || loading.rooms}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
            >
              <option value="">{loading.rooms ? "Checking availability..." : "Select room number"}</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.roomNumber} — ₹{Number(r.price).toLocaleString()} / night
                </option>
              ))}
            </select>
            <p className="mt-1 text-[12px] text-gray-400">Only rooms available for the selected dates are shown.</p>
          </div>

          {/* Price & summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div>
              <label className="block text-xs font-medium text-gray-700">Nights</label>
              <div className="mt-1 text-sm text-gray-900">{nights}</div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Price / night</label>
              <div className="mt-1 text-sm text-gray-900">
                {form.roomPrice ? `₹${Number(form.roomPrice).toLocaleString()}` : "-"}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">Total</label>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                {form.totalAmount ? `₹${Number(form.totalAmount).toLocaleString()}` : "₹0"}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div>
            {message && (
              <div className={`mb-2 text-sm ${message.includes("successful") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading.submit}
              className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
            >
              {loading.submit ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </form>

        <div className="text-xs text-gray-400 text-center">
          By proceeding you will be redirected to the payment page to complete the booking.
        </div>
      </div>
    </div>
  );
}
