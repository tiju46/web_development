const WorkOrder = require('../models/WorkOrder');
const Vehicle = require('../models/Vehicle');
const { convertToEUR } = require('../services/currencyService');

// Get all work orders (populating vehicle details)
exports.getAllWorkOrders = async (req, res) => {
  try {
    const orders = await WorkOrder.find()
      .populate('vehicle', 'regNumber make model status')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch work orders', details: err.message });
  }
};

// Create a new work order (Manager only)
exports.createWorkOrder = async (req, res) => {
  try {
    const { vehicleId, title, description, cost, currency } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Referenced vehicle does not exist' });
    }

    // Convert cost to EUR using external currency API
    const costInEUR = await convertToEUR(cost || 0, currency || 'EUR');

    const order = await WorkOrder.create({
      vehicle: vehicleId,
      title,
      description,
      cost: cost || 0,
      currency: currency ? currency.toUpperCase() : 'EUR',
      costInEUR,
      status: 'Pending',
    });

    // Mark vehicle as Under Maintenance
    vehicle.status = 'Under Maintenance';
    await vehicle.save();

    res.status(201).json({ message: 'Work order created', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create work order', details: err.message });
  }
};

// Update work order status (Pending -> In Progress -> Completed)
exports.updateWorkOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await WorkOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Work order not found' });
    }

    if (status) order.status = status;
    await order.save();

    // If order is completed, return vehicle status to Roadworthy
    if (status === 'Completed') {
      const vehicle = await Vehicle.findById(order.vehicle);
      if (vehicle) {
        vehicle.status = 'Roadworthy';
        await vehicle.save();
      }
    }

    res.status(200).json({ message: 'Work order status updated', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update work order', details: err.message });
  }
};

// Delete a work order (Manager only)
exports.deleteWorkOrder = async (req, res) => {
  try {
    const order = await WorkOrder.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Work order not found' });
    }
    res.status(200).json({ message: 'Work order deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete work order', details: err.message });
  }
};