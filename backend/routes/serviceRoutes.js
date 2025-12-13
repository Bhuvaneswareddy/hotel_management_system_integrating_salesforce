const express = require("express");
const router = express.Router();

const serviceController = require("../controllers/serviceController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// User creates service request
router.post("/", authenticate, serviceController.createServiceRequest);

// User gets his own requests
router.get("/my", authenticate, serviceController.getMyRequests);

// Admin/Manager sees ALL service requests
router.get("/", authenticate, authorize(["manager", "admin"]), serviceController.getAllServiceRequests);

module.exports = router;
