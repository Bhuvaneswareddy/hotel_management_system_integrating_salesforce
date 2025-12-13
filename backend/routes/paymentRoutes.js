const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Create payment
router.post('/', authenticate, authorize(['user']), paymentController.createPayment);

//Get payment reciepts by user
router.get("/user", authenticate, paymentController.getUserPayments);

// Get payment info for receipt
router.get('/:bookingId', authenticate, authorize(['user']), paymentController.getPaymentByBooking);

module.exports = router;
