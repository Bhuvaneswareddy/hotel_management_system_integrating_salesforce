"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Card, CardHeader } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

export default function AdminBranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    city: "",
    state: "",
    address: "",
    pincode: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/branches"); // adjust if needed
      const data = res.data || res || [];
      setBranches(data);
    } catch (err) {
      console.error("Error fetching branches:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load branches from backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!form.name || !form.city) {
      alert("Name and city are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await api.post("/branches", form); // adjust body fields if needed
      setForm({
        name: "",
        city: "",
        state: "",
        address: "",
        pincode: "",
      });
      await fetchBranches();
    } catch (err) {
      console.error("Error creating branch:", err);
      setError(
        err?.response?.data?.message || "Failed to create branch. Check backend."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Branches</h2>
          <p className="text-xs text-gray-500">
            Create and manage hotel branches across different cities.
          </p>
        </div>
        <Button variant="outline" onClick={fetchBranches}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Create Branch Form */}
      <Card>
        <CardHeader
          title="Create New Branch"
          subtitle="Fill in the branch details and save to add a new hotel."
        />
        <form
          onSubmit={handleCreateBranch}
          className="mt-2 grid gap-3 md:grid-cols-2"
        >
          <div className="space-y-1 text-xs">
            <label className="font-medium text-gray-700">
              Branch Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              placeholder="Hyderabad Central"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-medium text-gray-700">
              City <span className="text-red-500">*</span>
            </label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              placeholder="Hyderabad"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-medium text-gray-700">State</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              placeholder="Telangana"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-medium text-gray-700">Pincode</label>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              placeholder="500001"
            />
          </div>

          <div className="md:col-span-2 space-y-1 text-xs">
            <label className="font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
              placeholder="Street, area, landmark"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Branch"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Branch list */}
      <Card>
        <CardHeader
          title="Existing Branches"
          subtitle="All branches currently configured in the system."
        />
        {loading ? (
          <p className="mt-2 text-xs text-gray-500">Loading branches...</p>
        ) : branches.length === 0 ? (
          <p className="mt-2 text-xs text-gray-500">
            No branches found. Create your first branch above.
          </p>
        ) : (
          <div className="mt-2 space-y-2 text-xs">
            {branches.map((b) => (
              <div
                key={b.id || b._id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {b.name}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {b.city}, {b.state} {b.pincode ? `• ${b.pincode}` : ""}
                  </div>
                  {b.address && (
                    <div className="text-[11px] text-gray-400">
                      {b.address}
                    </div>
                  )}
                </div>
                <Badge variant="default">ID: {b.id || b._id}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
