const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Branch = require('./Branch');
const Room = require('./Room');

const Booking = sequelize.define(
  'Booking',
  {
    customerName: { type: DataTypes.STRING, allowNull: false },
    checkIn: { type: DataTypes.DATEONLY, allowNull: false },
    checkOut: { type: DataTypes.DATEONLY, allowNull: false },
    foodItems: { type: DataTypes.JSON, defaultValue: [] },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Booked' },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    roomId: { type: DataTypes.INTEGER, allowNull: false },
    branchId: { type: DataTypes.INTEGER, allowNull: false },
    MySQL_Id__c: { type: DataTypes.STRING }, // External ID for Salesforce
  },
  { tableName: 'bookings', timestamps: true }
);

// // Associations
// Branch.hasMany(Booking, { foreignKey: 'branchId', onDelete: 'CASCADE' });
// Booking.belongsTo(Branch, { foreignKey: 'branchId' });

// Room.hasMany(Booking, { foreignKey: 'roomId', onDelete: 'CASCADE' });
// Booking.belongsTo(Room, { foreignKey: 'roomId' });

module.exports = Booking;
