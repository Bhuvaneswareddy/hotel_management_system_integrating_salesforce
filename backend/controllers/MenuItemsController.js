const MenuItem = require('../models/MenuItem');

// Create a new Menu Item
exports.createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Menu Items (optionally filter by branch)
exports.getMenuItems = async (req, res) => {
  try {
    const { branchId } = req.query;
    const whereClause = branchId ? { branchId } : {};
    const menuItems = await MenuItem.findAll({ where: whereClause });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Menu Item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Menu Item
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

    await menuItem.update(req.body);
    res.status(200).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Menu Item
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

    await menuItem.destroy();
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};