const express = require('express');
const router = express.Router();

const foodOrderController = require('../controllers/FoodOrderController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Debug logs (optional – remove after testing)
console.log("Loaded FoodOrderController functions:");
console.log("createFoodOrder:", typeof foodOrderController.createFoodOrder);
console.log("getFoodOrders:", typeof foodOrderController.getFoodOrders);
console.log("getFoodOrderById:", typeof foodOrderController.getFoodOrderById);
console.log("updateFoodOrderStatus:", typeof foodOrderController.updateFoodOrderStatus);
console.log("deleteFoodOrder:", typeof foodOrderController.deleteFoodOrder);

// -----------------------------
// Create a new food order
// Accessible by: user, manager, admin
// -----------------------------
router.post(
  '/',
  authenticate,
  authorize(['user', 'manager', 'admin']),
  foodOrderController.createFoodOrder
);

// -----------------------------
// Get all food orders
// Accessible by: manager, admin
// -----------------------------
router.get(
  '/',
  authenticate,
  authorize(['manager', 'admin']),
  foodOrderController.getFoodOrders
);

// -----------------------------
// Get a single food order by ID
// Accessible by: user, manager, admin
// -----------------------------
router.get(
  '/:id',
  authenticate,
  authorize(['user', 'manager', 'admin']),
  foodOrderController.getFoodOrderById
);

// -----------------------------
// Update food order status
// Accessible by: manager, admin
// -----------------------------
router.put(
  '/:id/status',
  authenticate,
  authorize(['manager', 'admin']),
  foodOrderController.updateFoodOrderStatus
);

// -----------------------------
// Delete an order
// Accessible by: admin
// -----------------------------
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  foodOrderController.deleteFoodOrder
);

module.exports = router;
