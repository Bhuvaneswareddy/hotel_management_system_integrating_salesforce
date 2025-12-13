const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Branch = require('./Branch'); // import Branch

const Room = sequelize.define(
  'Room',
  {
    roomNumber: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Available' },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Branch,
        key: 'id',
      },
    },
  },
  { tableName: 'rooms', timestamps: true }
);

// Associations
Branch.hasMany(Room, { foreignKey: 'branchId', onDelete: 'CASCADE' });
Room.belongsTo(Branch, { foreignKey: 'branchId' });

module.exports = Room;
