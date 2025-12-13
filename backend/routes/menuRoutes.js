const express = require('express');
const router = express.Router();
const menuController = require('../controllers/MenuItemsController');

// Create menu item
router.post('/', menuController.createMenuItem);

// Get menu items
router.get('/', menuController.getMenuItems);

// Get single item
router.get('/:id', menuController.getMenuItemById);

// Update item
router.put('/:id', menuController.updateMenuItem);

// Delete item
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;
