const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
  bookingId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  paymentMethod: { type: DataTypes.STRING, allowNull: false },
  transactionId: { type: DataTypes.STRING, allowNull: false, unique: true },
  status: { type: DataTypes.ENUM('Pending','Completed','Failed'), defaultValue: 'Pending' }
}, {
  tableName: 'payments',
  timestamps: true
});

module.exports = Payment;
