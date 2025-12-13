const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Branch = require('./Branch');

const MenuItem = sequelize.define('MenuItem', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING, // e.g., Starter, Main Course, Dessert, Beverage
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  availability: {
    type: DataTypes.STRING,
    defaultValue: 'Available', // Available or Out of Stock
    field: 'available'
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "branch_id",
    references: {
      model: Branch,
      key: 'id',
    },
  },
},
{
  tableName: "menu_items",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
}
);

// Associations
Branch.hasMany(MenuItem, { foreignKey: 'branchId', onDelete: 'CASCADE' });
MenuItem.belongsTo(Branch, { foreignKey: 'branchId' });

module.exports = MenuItem;
