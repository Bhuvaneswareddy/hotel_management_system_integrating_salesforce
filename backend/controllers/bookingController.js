const { Op } = require('sequelize');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Branch = require('../models/Branch');

// ------------------------
// Create a new booking (only called after successful payment)
// ------------------------
exports.createBooking = async (req, res) => {
  console.log("Incoming booking data:", req.body);
  console.log("Authenticated user:", req.user);

  try {
    const { customerName, branchId, roomId, checkIn, checkOut, totalAmount, foodItems } = req.body;

    // Validate room exists
    const room = await Room.findByPk(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Room must be available
    if (room.status !== 'Available') {
      return res.status(400).json({ message: 'Room not available' });
    }

    // Check for overlapping bookings
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
    if (overlapping) {
      return res.status(400).json({ message: 'Room already booked for this date range' });
    }

    // Create booking
    const booking = await Booking.create({
      customerName,
      branchId,
      roomId,
      checkIn,
      checkOut,
      totalAmount,
      foodItems: foodItems || [],
      status: 'Confirmed', // Status can stay 'Confirmed' if payment is already done
      userId: req.user.id,
    });

    console.log("Booking successfully created:", booking);
    res.status(201).json(booking);

  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// ------------------------
// Get all bookings (manager/admin)
// ------------------------
// ------------------------
// Get all bookings (manager/admin)
// ------------------------
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll(); // no include -> no alias error
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ------------------------
// Get bookings for logged-in user
// ------------------------
// Get bookings for logged-in user
// ------------------------
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      // no include -> avoids alias error
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ------------------------
// Get active booking for logged-in user
// ------------------------
exports.getMyActiveBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        userId: req.user.id,
        status: "Confirmed"  // Only confirmed bookings count as active
      }
    });

    if (!booking) {
      return res.status(404).json({ message: "No active booking found" });
    }

    return res.status(200).json(booking);

  } catch (error) {
    console.error("Error fetching active booking:", error);
    return res.status(500).json({ error: error.message });
  }
};


// ------------------------
// Update booking status (manager/admin)
// ------------------------
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ------------------------
// Cancel booking (user/manager/admin)
// ------------------------
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'Cancelled';
    await booking.save();
    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports = {
  createBooking: exports.createBooking,
  getBookings: exports.getBookings,
  getUserBookings: exports.getUserBookings,
  getMyActiveBooking: exports.getMyActiveBooking,
  updateBookingStatus: exports.updateBookingStatus,
  cancelBooking: exports.cancelBooking,
};


