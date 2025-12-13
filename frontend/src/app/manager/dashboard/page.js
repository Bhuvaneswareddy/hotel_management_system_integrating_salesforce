"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function ManagerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [branch, setBranch] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "manager") return;

        // Fetch branch details for this manager
        const branchRes = await api.get(`/branches/${user.branchId}`);
        setBranch(branchRes);

        // Fetch bookings for this branch
        const bookingsRes = await api.get("/bookings");
        const branchBookings = bookingsRes.filter(b => b.branchId === user.branchId);
        setBookings(branchBookings);

        // Fetch rooms for this branch
        const roomsRes = await api.get("/rooms");
        const branchRooms = roomsRes.filter(r => r.branchId === user.branchId);
        setRooms(branchRooms);

        // Fetch food items for this branch
        const foodRes = await api.get("/food");
        const branchFood = foodRes.filter(f => f.branchId === user.branchId);
        setFoodItems(branchFood);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch branch data. Is the backend running?");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {branch && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Branch: {branch.name}</h2>
          <p>{branch.city}, {branch.state}</p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Rooms</h2>
        <ul className="space-y-1">
          {rooms.map(room => (
            <li key={room.id} className="p-2 bg-gray-100 rounded">
              {room.roomNumber} ({room.type}) - {room.status}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Food Items</h2>
        <ul className="space-y-1">
          {foodItems.map(food => (
            <li key={food.id} className="p-2 bg-gray-100 rounded">
              {food.name} ({food.category}) - {food.availability}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Bookings</h2>
        <ul className="space-y-1">
          {bookings.map(booking => (
            <li key={booking.id} className="p-2 bg-gray-100 rounded">
              ID: {booking.id} | Customer: {booking.customerName} | Status: {booking.status} | Room: {booking.roomId}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
