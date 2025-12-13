const FoodOrder = require('../models/FoodOrders');
const OrderItem = require('../models/OrderItems');
const MenuItem = require('../models/MenuItem');

// ------------------------------
// Create a new food order
// ------------------------------
exports.createFoodOrder = async (req, res) => {
  try {
    const { booking_id, branch_id, status, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Items are required" });
    }

    // Compute total amount
    const total_amount = items.reduce(
      (sum, item) => sum + item.price_each * item.quantity,
      0
    );

    // Create the order
    const order = await FoodOrder.create({
      booking_id,
      userId: req.user.id,
      branch_id,
      total_amount,
      status: status || "PENDING",
      order_time: new Date()
    });

    // Order items (NO total_price since it's generated)
    const orderItems = items.map(i => ({
      order_id: order.id,
      menu_item_id: i.menu_item_id,
      quantity: i.quantity,
      price_each: i.price_each
    }));

    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({
      message: "Order created successfully",
      orderId: order.id
    });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ------------------------------
// Get all orders
// ------------------------------
exports.getFoodOrders = async (req, res) => {
  try {
    const orders = await FoodOrder.findAll({
      include: [{ 
        model: OrderItem, 
        include: [MenuItem] 
      }],
      order: [["created_at", "DESC"]]
    });

    res.status(200).json(orders);

  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ------------------------------
// Get an order by ID
// ------------------------------
exports.getFoodOrderById = async (req, res) => {
  try {
    const order = await FoodOrder.findByPk(req.params.id, {
      include: [{ 
        model: OrderItem, 
        include: [MenuItem] 
      }]
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);

  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ------------------------------
// Update order status
// ------------------------------
exports.updateFoodOrderStatus = async (req, res) => {
  try {
    const order = await FoodOrder.findByPk(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status || order.status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });

  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ------------------------------
// Delete order
// ------------------------------
exports.deleteFoodOrder = async (req, res) => {
  try {
    const order = await FoodOrder.findByPk(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.destroy();

    res.status(200).json({ message: "Order deleted successfully" });

  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ error: error.message });
  }
};
