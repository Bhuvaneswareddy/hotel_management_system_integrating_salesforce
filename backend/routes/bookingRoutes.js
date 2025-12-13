const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Create booking (user or manager)
router.post('/', authenticate, authorize(['user','manager','admin']), bookingController.createBooking);

// Fetch all bookings (manager/admin)
router.get('/', authenticate, authorize(['manager','admin']), bookingController.getBookings);

// Fetch bookings for logged-in user
router.get('/my', authenticate, authorize(['user']), bookingController.getUserBookings);

//active booking user
router.get("/my-active", authenticate, bookingController.getMyActiveBooking);


// Update booking status
router.patch('/:id/status', authenticate, authorize(['manager','admin']), bookingController.updateBookingStatus);

// Cancel booking
router.patch('/:id/cancel', authenticate, authorize(['user','manager','admin']), bookingController.cancelBooking);

module.exports = router;
