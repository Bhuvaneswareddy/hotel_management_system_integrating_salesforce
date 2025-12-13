"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../../services/api";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // "error" | "success"
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setMessage(""); // clear on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setMessageType("error");
      setMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const data = await loginUser(form);

      // store token + user
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setMessageType("success");
      setMessage("Login successful. Redirecting...");

      // Redirect based on role
      const role = data?.user?.role;
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "manager") {
        router.push("/manager/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900 text-center">
          Login
        </h1>
        <p className="mt-1 text-center text-xs text-gray-500">
          Sign in to manage your bookings and hotel data.
        </p>

        {message && (
          <div
            className={
              "mt-4 rounded-lg px-3 py-2 text-xs " +
              (messageType === "success"
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-red-200 bg-red-50 text-red-700")
            }
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-green-600 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-gray-500">
          Don&apos;t have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => router.push("/auth/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
