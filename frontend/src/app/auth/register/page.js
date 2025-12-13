"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../../services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    branchId: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // "error" | "success"
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!form.name || !form.email || !form.password) {
      setMessageType("error");
      setMessage("Please fill all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setMessageType("error");
      setMessage("Password should be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match.");
      return;
    }

    if (
      (form.role === "user" || form.role === "manager") &&
      !form.branchId
    ) {
      setMessageType("error");
      setMessage("Branch ID is required for users and managers.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        branchId: form.branchId || null,
      };

      const data = await registerUser(payload);

      setMessageType("success");
      setMessage(data.message || "Registered successfully.");

      // redirect to login after short delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 800);
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900 text-center">
          Create an Account
        </h1>
        <p className="mt-1 text-center text-xs text-gray-500">
          Register to book rooms and manage hotel services.
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
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <p className="mt-1 text-[10px] text-gray-400">
              Tip: Usually normal customers use the <b>User</b> role. Manager and
              Admin are for internal staff.
            </p>
          </div>

          {(form.role === "user" || form.role === "manager") && (
            <div className="space-y-1">
              <label className="font-medium text-gray-700">
                Branch ID <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="branchId"
                placeholder="Enter branch ID provided by admin"
                value={form.branchId}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-blue-600 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-gray-500">
          Already have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
