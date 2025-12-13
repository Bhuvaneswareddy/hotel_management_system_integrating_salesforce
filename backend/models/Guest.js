const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Room = require('./Room');

const Guest = sequelize.define('Guest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  checkInDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkOutDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'guests',
  timestamps: true,
});

// Define relation: Guest belongs to a Room
Guest.belongsTo(Room, {
  foreignKey: 'roomId',
  onDelete: 'SET NULL', // if room is deleted, guest's roomId becomes null
});
Room.hasMany(Guest, { foreignKey: 'roomId' });

module.exports = Guest;
