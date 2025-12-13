const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Branch = require('./Branch');
const Booking = require('./Booking');

// -----------------------------
// FoodOrder Model
// -----------------------------
const FoodOrder = sequelize.define(
  'FoodOrder',
  {
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Booking,
        key: 'id'
      }
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Branch,
        key: 'id'
      }
    },

    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false   // NOT NULL in DB
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: 'PENDING'
    },

    order_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

module.exports = FoodOrder;
