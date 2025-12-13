"use client";

import { useState } from "react";

export default function ServiceRequestPage() {
  const serviceTypes = [
    "Housekeeping",
    "Laundry",
    "Room Cleaning",
    "Maintenance",
    "Food Delivery",
    "Other",
  ];

  const [selectedService, setSelectedService] = useState("");
  const [description, setDescription] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedService) return setError("Please select a service.");
    if (!description.trim()) return setError("Description is required.");

    // No API – just show success screen
    setSuccess("Your service request has been submitted successfully!");
    setSelectedService("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-3xl font-semibold mb-6">Request a Service</h1>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-100 border border-green-200 p-4 rounded-lg animate-fadeIn">
          <h2 className="text-lg font-semibold text-green-700">{success}</h2>
          <p className="text-gray-600 mt-1">
            Our staff will attend to your room shortly.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-200 p-3 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Service Type */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Select Service
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full border rounded-lg p-3 bg-gray-50"
            >
              <option value="">-- Choose a service --</option>
              {serviceTypes.map((type, i) => (
                <option key={i} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your request..."
              className="w-full border rounded-lg p-3 bg-gray-50"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Submit Request
          </button>
        </form>
      </div>

      {/* No past requests list, since you don’t want to store anything */}
    </div>
  );
}
