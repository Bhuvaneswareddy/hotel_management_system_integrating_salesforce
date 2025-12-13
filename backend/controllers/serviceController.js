const ServiceRequest = require("../models/ServiceRequest");

// -----------------------------------
// Create a new service request
// -----------------------------------
exports.createServiceRequest = async (req, res) => {
  try {
    const { type, description } = req.body;
    const guest_id = req.user.id; // Logged-in user

    // Active booking information (if needed)
    const bookingId = req.body.booking_id || null;
    const roomId = req.body.room_id || null;
    const branchId = req.body.branch_id || null;

    if (!type || !description || !branchId || !roomId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const serviceRequest = await ServiceRequest.create({
      branch_id: branchId,
      room_id: roomId,
      booking_id: bookingId,
      guest_id,
      type,
      description,
      status: "Pending",
      request_at: new Date(),
    });

    res
      .status(201)
      .json({ message: "Service request submitted successfully", serviceRequest });
  } catch (err) {
    console.error("Create Service Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------------
// Get ALL service requests (admin/manager)
// -----------------------------------
exports.getAllServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.findAll({
      order: [["request_at", "DESC"]],
    });

    res.json(serviceRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -----------------------------------
// Get MY service requests (user)
// -----------------------------------
exports.getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await ServiceRequest.findAll({
      where: { guest_id: userId },
      order: [["request_at", "DESC"]],
    });

    res.json(requests);
  } catch (err) {
    console.error("My Requests Error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createServiceRequest: exports.createServiceRequest,
  getAllServiceRequests: exports.getAllServiceRequests,
  getMyRequests: exports.getMyRequests,
};
