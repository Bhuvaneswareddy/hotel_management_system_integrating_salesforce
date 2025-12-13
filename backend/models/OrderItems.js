const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FoodOrder = require('./FoodOrders');
const MenuItem = require('./MenuItem');

// -----------------------------
// OrderItem Model
// -----------------------------
const OrderItem = sequelize.define(
  'OrderItem',
  {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FoodOrder,
        key: 'id'
      }
    },

    menu_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MenuItem,
        key: 'id'
      }
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    price_each: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    // DO NOT add total_price here
    // MySQL generates it automatically:
    // total_price = quantity * price_each
  },
  {
    tableName: 'order_items',
     timestamps: false
    
  }
);

// -----------------------------
// Model Associations
// -----------------------------
OrderItem.belongsTo(FoodOrder, {
  foreignKey: 'order_id'
});

OrderItem.belongsTo(MenuItem, {
  foreignKey: 'menu_item_id'
});

module.exports = OrderItem;
