const { Op } = require('sequelize');
const { Payment, Booking, Room, Branch} = require('../models');

// ------------------------
// Create payment AND booking
// ------------------------
exports.createPayment = async (req, res) => {
  console.log('Incoming payment request:', req.body);
  console.log('Authenticated user:', req.user);

  try {
    const {
      customerName,
      branchId,
      roomId,
      checkIn,
      checkOut,
      totalAmount,
      paymentMethod,
      transactionId,
    } = req.body;

    // Validate room exists
    const room = await Room.findByPk(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.status !== 'Available') return res.status(400).json({ message: 'Room not available' });

    // Check overlapping bookings
    const overlapping = await Booking.findOne({
      where: {
        roomId,
        status: { [Op.ne]: 'Cancelled' },
        [Op.or]: [
          {
            checkIn: { [Op.lt]: new Date(checkOut) },
            checkOut: { [Op.gt]: new Date(checkIn) },
          },
        ],
      },
    });
    if (overlapping) return res.status(400).json({ message: 'Room already booked for this date range' });

    // 1️⃣ Create booking AFTER payment validation
    const booking = await Booking.create({
      customerName,
      branchId,
      roomId,
      checkIn,
      checkOut,
      totalAmount,
      status: 'Confirmed',
      userId: req.user.id,
    });

    // 2️⃣ Record payment
    const payment = await Payment.create({
      bookingId: booking.id,
      amount: totalAmount,
      paymentMethod,
      transactionId,
      status: 'Completed',
    });

    console.log('Booking created:', booking);
    console.log('Payment recorded:', payment);

    res.status(201).json({ message: 'Payment successful', booking, payment });

  } catch (error) {
    console.error('Payment or booking failed:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get Payment by userId
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: { model: Booking, as: "Booking" },
      where: { "$Booking.userId$": req.user.id }
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ------------------------
// Get payment by booking ID
// ------------------------
exports.getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Find payment and include associated Booking, Room, Branch
    const payment = await Payment.findOne({
      where: { bookingId },
      include: [
        {
          model: Booking,
          as: 'Booking',
          include: [
            { model: Room, as: 'Room' },
            { model: Branch, as: 'Branch' }
          ]
        }
      ]
    });

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Authorization: only the user who made the booking can view
    if (payment.Booking.userId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: error.message });
  }
};

