"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../services/api";

export default function ReceiptsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("Loading receipts...");

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("You are not authorized.");
          return;
        }

        const res = await api.get("/payments/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPayments(res.data);
        if (res.data.length === 0) setMessage("No receipts found.");
      } catch (err) {
        console.error("Error fetching receipts:", err.response?.data || err.message);
        setMessage("Failed to load receipts.");
      }
    };

    fetchReceipts();
  }, []);

  if (!payments.length) {
    return (
      <div className="p-8 text-center">
        <p>{message}</p>
        <button
          onClick={() => router.push("/user/dashboard")}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Payment Receipts</h1>
        <button
          onClick={() => router.push("/user/dashboard")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <div key={payment.id} className="p-4 border rounded shadow">
            <p><strong>Booking ID:</strong> {payment.bookingId}</p>
            <p><strong>Customer Name:</strong> {payment.Booking?.customerName || "N/A"}</p>
            <p><strong>Amount:</strong> ${payment.amount}</p>
            <p><strong>Payment Method:</strong> {payment.paymentMethod}</p>
            <p><strong>Transaction ID:</strong> {payment.transactionId}</p>
            <p><strong>Status:</strong> {payment.status}</p>
            <p><strong>Paid On:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
