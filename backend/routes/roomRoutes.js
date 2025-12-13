const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Create a new room (Admin only)
router.post('/', authenticate, authorize(['admin']), roomController.createRoom);

// Get all rooms
router.get('/', authenticate, authorize(['user','manager','admin']), roomController.getRooms);

// Get rooms for a specific branch
router.get('/branch/:branchId', authenticate, authorize(['manager','admin']), roomController.getRoomsByBranch);

// Get unique room types for a branch
router.get('/types/:branchId', authenticate, authorize(['user','manager','admin']), roomController.getRoomTypesByBranch);

// Get available rooms for a branch + type + date range
router.get('/available', authenticate, authorize(['user','manager','admin']), roomController.getAvailableRooms);

//get all rooms irrespective of status
router.get('/branch/:branchId/all', authenticate, authorize(['admin','manager','user']), roomController.getAllRoomsByBranch);

module.exports = router;
