"use client";

import React, { useEffect, useState } from "react";

// -------- Inline Icons (no external libs) -------
const CartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="w-8 h-8 animate-spin text-gray-700" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10"
      stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor"
      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
  </svg>
);

// ------------------------------------------------------

export default function FoodPage() {
  const API = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

  // Menu
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cart
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Branch & room selection
  const [branches, setBranches] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");

  // Checkout fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch menu
  useEffect(() => {
    fetchMenu();
    fetchBranches();
  }, []);

  async function fetchMenu() {
    try {
      const res = await fetch(`${API}/menuItems`);
      const data = await res.json();
      setMenu(Array.isArray(data) ? data : []);
    } catch {
      setError("Unable to load menu.");
    }
    setLoading(false);
  }

  async function fetchBranches() {
    try {
      const res = await fetch(`${API}/branches`);
      const data = await res.json();
      setBranches(Array.isArray(data) ? data : []);
    } catch {}
  }

 async function fetchRooms(branchId) {
  setSelectedRoom("");
  setRooms([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  try {
    const res = await fetch(`${API}/rooms/branch/${branchId}/all`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    });

    if (!res.ok) {
      console.warn("Failed to fetch rooms:", res.status);
      return;
    }

    const data = await res.json();
    setRooms(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Room fetch error:", err);
  }
}


  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);
      if (exist)
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const cartTotal = () =>
    cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2);

  // -------------------------------------------
  // PLACE ORDER — REAL BACKEND CALL
  // -------------------------------------------
  const placeOrder = async () => {
  setError("");
  setSuccess("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!selectedBranch) return setError("Please select a branch.");
  if (!selectedRoom) return setError("Please select a room.");
  if (!name.trim()) return setError("Name is required.");
  if (!phone.trim()) return setError("Phone is required.");
  if (cart.length === 0) return setError("Cart is empty.");

  setPlacingOrder(true);

  const payload = {
    booking_id: selectedRoom,
    branch_id: selectedBranch,
   // total_amount: Number(cartTotal()),
    status: "PENDING",
    items: cart.map((item) => ({
      menu_item_id: item.id,
      quantity: item.quantity,
      price_each: item.price,
    })),
  };

  try {
    const res = await fetch(`${API}/food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Order failed");

    setSuccess("Order placed successfully!");
    setCart([]);

    setTimeout(() => setIsCheckoutOpen(false), 1200);
  } catch (err) {
    setError(err.message);
  }

  setPlacingOrder(false);
};


  return (
    <main className="min-h-screen bg-[#F9FAFB] p-6 font-[Inter]">

      {/* Back */}
      <a href="/user/dashboard" className="text-gray-700 text-sm hover:text-black">
        ← Back to Dashboard
      </a>

      <h1 className="text-2xl font-semibold mt-4 mb-6">Room Service Menu</h1>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <LoaderIcon />
        </div>
      )}

      {/* Menu grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col"
          >
            <h2 className="text-lg font-medium">{item.name}</h2>
            <p className="text-gray-500">₹{item.price}</p>

            <button
              onClick={() => addToCart(item)}
              className="mt-auto bg-black text-white py-2 rounded-xl hover:bg-gray-800 mt-4"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-black text-white rounded-full p-4 shadow-xl hover:scale-105 transition"
      >
        <CartIcon />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-2 py-0.5 rounded-full">
            {cart.length}
          </span>
        )}
      </button>

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50">
          <div className="w-80 h-full bg-white rounded-l-3xl shadow-xl p-6 relative">

            <button
              onClick={() => setIsCartOpen(false)}
              className="absolute top-4 right-4"
            >
              <CloseIcon />
            </button>

            <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

            {cart.length === 0 ? (
              <p className="text-gray-500">Cart is empty.</p>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <p>{item.name} × {item.quantity}</p>
                      <p className="font-medium">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <p className="text-lg font-semibold">Total: ₹{cartTotal()}</p>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full bg-black text-white py-3 rounded-xl mt-6 hover:bg-gray-800"
                >
                  Checkout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

            <h2 className="text-xl font-semibold mb-4">Checkout</h2>

            {error && <p className="text-red-600 mb-2">{error}</p>}
            {success && <p className="text-green-600 mb-2">{success}</p>}

            {/* Branch */}
            <select
              className="w-full p-3 border rounded-xl mb-3"
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                fetchRooms(e.target.value);
              }}
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Room */}
            <select
              className="w-full p-3 border rounded-xl mb-3"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              <option value="">Select Room</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.roomNumber}
                </option>
              ))}
            </select>

            {/* User Details */}
            <input
              className="w-full p-3 border rounded-xl mb-3"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full p-3 border rounded-xl mb-3"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <textarea
              className="w-full p-3 border rounded-xl mb-3"
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* Confirm Order */}
            <button
              onClick={placeOrder}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
            >
              {placingOrder ? "Placing Order…" : "Confirm Order"}
            </button>

            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="w-full bg-gray-200 py-2 rounded-xl mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
