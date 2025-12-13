const Booking = require('./Booking');
const Payment = require('./Payment');
const Room = require('./Room');
const Branch = require('./Branch');

// Booking ↔ Room & Branch
Booking.belongsTo(Room, { foreignKey: 'roomId', onDelete: 'CASCADE', as: 'Room' });
Booking.belongsTo(Branch, { foreignKey: 'branchId', onDelete: 'CASCADE', as: 'Branch' });
Room.hasMany(Booking, { foreignKey: 'roomId' });
Branch.hasMany(Booking, { foreignKey: 'branchId' });

// Booking ↔ Payment
Booking.hasOne(Payment, { foreignKey: 'bookingId', as: 'Payment' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'Booking' });

module.exports = { Booking, Payment, Room, Branch };
