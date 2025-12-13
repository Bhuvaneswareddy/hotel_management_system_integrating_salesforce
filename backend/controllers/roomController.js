const { Op } = require('sequelize');
const Room = require('../models/Room');
const Branch = require('../models/Branch');
const Booking = require('../models/Booking');

// Ensure associations exist:
// Room.belongsTo(Branch, { foreignKey: 'branchId' });
// Branch.hasMany(Room, { foreignKey: 'branchId' });
// Booking.belongsTo(Room, { foreignKey: 'roomId' });
// Room.hasMany(Booking, { foreignKey: 'roomId' });

// ------------------------
// Create a new room (Admin only)
// ------------------------
exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, type, price, status, branchId } = req.body;

    const branch = await Branch.findByPk(branchId);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });

    const room = await Room.create({ roomNumber, type, price, status, branchId });
    res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Get all rooms (Admin/Manager/User)
// ------------------------
exports.getRooms = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === 'manager') whereClause.branchId = req.user.branchId;
    if (req.user.role === 'user') whereClause.status = 'Available';

    const rooms = await Room.findAll({
      where: whereClause,
      include: { model: Branch, attributes: ['id', 'name'] },
    });

    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Get rooms for a specific branch (Admin/Manager)
// ------------------------
exports.getRoomsByBranch = async (req, res) => {
  try {
    const branchId = parseInt(req.params.branchId, 10);
    if (isNaN(branchId)) return res.status(400).json({ message: 'Invalid branchId' });

    if (req.user.role === 'manager' && req.user.branchId !== branchId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const rooms = await Room.findAll({
      where: { branchId },
      include: { model: Branch, attributes: ['id', 'name'] },
    });

    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms by branch:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------------
// Get distinct room types for a branch
// ------------------------
exports.getRoomTypesByBranch = async (req, res) => {
  try {
    const branchId = parseInt(req.params.branchId, 10);
    if (isNaN(branchId)) return res.status(400).json({ message: 'Invalid branchId' });

    const rooms = await Room.findAll({
      where: { branchId },
      attributes: ['type'],
      group: ['type'],
    });

    const roomTypes = rooms.map(r => r.type);
    res.status(200).json(roomTypes);
  } catch (error) {
    console.error('Error fetching room types:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/rooms/branch/:branchId/all
exports.getAllRoomsByBranch = async (req, res) => {
  try {
    const branchId = parseInt(req.params.branchId, 10);
    if (isNaN(branchId)) return res.status(400).json({ message: 'Invalid branchId' });

    // No role/status filtering here — return all rooms for the branch
    const rooms = await Room.findAll({
      where: { branchId },
      attributes: ['id', 'roomNumber', 'type', 'price', 'status', 'branchId'],
      include: { model: Branch, attributes: ['id', 'name'] },
    });

    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching all rooms by branch:', error);
    res.status(500).json({ message: error.message });
  }
};


// ------------------------
// Get available rooms for a branch + type + date range
// ------------------------
exports.getAvailableRooms = async (req, res) => {
  try {
    const { branchId, type, checkIn, checkOut } = req.query;

    if (!branchId || !type || !checkIn || !checkOut) {
      return res.status(400).json({ message: 'branchId, type, checkIn, and checkOut are required' });
    }

    const branchIdNum = parseInt(branchId, 10);
    if (isNaN(branchIdNum)) return res.status(400).json({ message: 'Invalid branchId' });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // 1️⃣ Fetch all rooms of the branch and type
    const rooms = await Room.findAll({
      where: { branchId: branchIdNum, type },
      attributes: ['id', 'roomNumber', 'price', 'status', 'branchId'],
    });

    if (!rooms.length) return res.status(200).json([]);

    // 2️⃣ Fetch overlapping bookings
    const overlappingBookings = await Booking.findAll({
      where: {
        roomId: { [Op.in]: rooms.map(r => r.id) },
        status: { [Op.ne]: 'Cancelled' },
        [Op.and]: [
          { checkIn: { [Op.lt]: checkOutDate } },
          { checkOut: { [Op.gt]: checkInDate } },
        ],
      },
      attributes: ['roomId'],
    });

    const bookedRoomIds = overlappingBookings.map(b => b.roomId);

    // 3️⃣ Filter out booked rooms
    const availableRooms = rooms.filter(r => !bookedRoomIds.includes(r.id));

    console.log('Available rooms:', availableRooms.map(r => r.roomNumber));

    res.status(200).json(availableRooms);
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
