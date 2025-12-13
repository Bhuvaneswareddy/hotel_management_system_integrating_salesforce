const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Branch = require("./Branch");
const Room = require("./Room");
const Booking = require("./Booking");
const Guest = require("./Guest");

const ServiceRequest = sequelize.define(
  "ServiceRequest",
  {
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Branch, key: "id" },
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Room, key: "id" },
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Booking, key: "id" },
    },
    guest_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Guest, key: "id" },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "In Progress", "Completed"),
      defaultValue: "Pending",
    },
    assigned_to: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    request_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "service_requests",
    timestamps: false,
  }
);

// Associations
Branch.hasMany(ServiceRequest, { foreignKey: "branch_id" });
Room.hasMany(ServiceRequest, { foreignKey: "room_id" });
Booking.hasMany(ServiceRequest, { foreignKey: "booking_id" });
Guest.hasMany(ServiceRequest, { foreignKey: "guest_id" });

ServiceRequest.belongsTo(Branch, { foreignKey: "branch_id" });
ServiceRequest.belongsTo(Room, { foreignKey: "room_id" });
ServiceRequest.belongsTo(Booking, { foreignKey: "booking_id" });
ServiceRequest.belongsTo(Guest, { foreignKey: "guest_id" });

module.exports = ServiceRequest;
