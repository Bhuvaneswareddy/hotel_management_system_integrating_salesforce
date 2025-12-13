const FoodOrder = require('../models/FoodOrders');
const OrderItem = require('../models/OrderItems');
const MenuItem = require('../models/MenuItem');

// Create a new Food Order with items
exports.createFoodOrder = async (req, res) => {
  const { booking_id, guest_id, branch_id, total_amount, status, items } = req.body;

  try {
    const order = await FoodOrder.create({
      booking_id,
      guest_id,
      branch_id,
      total_amount,
      status: status || 'PENDING',
      order_time: new Date()
    });

    if (items && items.length > 0) {
      const orderItems = items.map(i => ({
        order_id: order.id,
        menu_item_id: i.menu_item_id,
        quantity: i.quantity,
        price_each: i.price_each,
        total_price: i.price_each * i.quantity
      }));
      await OrderItem.bulkCreate(orderItems);
    }

    res.status(201).json({ message: 'Order created successfully', orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Food Orders with items
exports.getFoodOrders = async (req, res) => {
  try {
    const orders = await FoodOrder.findAll({
      include: [{ model: OrderItem, include: [MenuItem] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single Food Order by ID
exports.getFoodOrderById = async (req, res) => {
  try {
    const order = await FoodOrder.findByPk(req.params.id, {
      include: [{ model: OrderItem, include: [MenuItem] }]
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Food Order status
exports.updateFoodOrderStatus = async (req, res) => {
  try {
    const order = await FoodOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    await order.save();

    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Food Order
exports.deleteFoodOrder = async (req, res) => {
  try {
    const order = await FoodOrder.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.destroy();
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};