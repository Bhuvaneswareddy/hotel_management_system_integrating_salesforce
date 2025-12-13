const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Branch = sequelize.define('Branch', {
  name: { type: DataTypes.STRING, allowNull: false },
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  country: DataTypes.STRING,
  zipCode: DataTypes.STRING,
  phone: DataTypes.STRING
}, { tableName: 'branches', timestamps: true });

module.exports = Branch;
