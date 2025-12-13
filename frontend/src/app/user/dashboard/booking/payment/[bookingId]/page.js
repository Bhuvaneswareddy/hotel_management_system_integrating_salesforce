"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../../../../../services/api";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse booking data from query string
  const bookingData = searchParams.get("bookingData")
    ? JSON.parse(searchParams.get("bookingData"))
    : null;

  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  if (!bookingData) {
    return (
      <p className="p-8 text-center">
        Booking data not found. Please go back and try again.
      </p>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!transactionId.trim()) {
      setMessage("Please enter a valid transaction ID.");
      return;
    }

    try {
      // Send booking + payment data to backend
      const res = await api.post("/payments", {
        ...bookingData,
        paymentMethod,
        transactionId,
      });

      console.log("Payment response:", res.data);

      setMessage("Payment successful!");
      setSuccess(true);
    } catch (err) {
      console.error("Payment or booking failed:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Payment failed. Please try again.");
    }
  };

  const navigateToDashboard = () => {
    router.push("/user/dashboard");
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Payment for {bookingData.customerName}
      </h1>

      {message && (
        <p className={`mb-4 ${success ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      {!success ? (
        <>
          <div className="mb-4">
            <p><strong>Check-in:</strong> {new Date(bookingData.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(bookingData.checkOut).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ${bookingData.totalAmount}</p>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <label className="block">
              Payment Method
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Wallet">Wallet</option>
              </select>
            </label>

            <label className="block">
              Transaction ID
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
                className="w-full p-2 border rounded mt-1"
                placeholder="Enter transaction ID"
              />
            </label>

            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Pay ${bookingData.totalAmount}
            </button>
          </form>
        </>
      ) : (
        <div className="mt-4">
          <button
            onClick={navigateToDashboard}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
