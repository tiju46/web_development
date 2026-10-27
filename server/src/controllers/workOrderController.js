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

exports.updateWorkOrderStatus = async (req, res) => {
  try {
    const { vehicleId, title, description, cost, currency, status } = req.body;
    const order = await WorkOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Work order not found' });
    }

    if (title !== undefined) order.title = title;
    if (description !== undefined) order.description = description;

    // Handle vehicle reassignment if vehicleId provided
    if (vehicleId && vehicleId !== String(order.vehicle)) {
      const newVehicle = await Vehicle.findById(vehicleId);
      if (!newVehicle) {
        return res.status(404).json({ error: 'Target vehicle does not exist' });
      }
      order.vehicle = vehicleId;
    }

    const costChanged = cost !== undefined && Number(cost) !== order.cost;
    const currencyChanged = currency && currency.toUpperCase() !== order.currency;

    if (costChanged || currencyChanged) {
      const activeCost = cost !== undefined ? Number(cost) : order.cost;
      const activeCurrency = currency ? currency.toUpperCase() : order.currency;

      order.cost = activeCost;
      order.currency = activeCurrency;
      order.costInEUR = await convertToEUR(activeCost, activeCurrency);
    }

    if (status && status !== order.status) {
      order.status = status;

      if (status === 'Completed') {
        const vehicle = await Vehicle.findById(order.vehicle);
        if (vehicle) {
          vehicle.status = 'Roadworthy';
          await vehicle.save();
        }
      } else if (status === 'In Progress' || status === 'Pending') {
        const vehicle = await Vehicle.findById(order.vehicle);
        if (vehicle && vehicle.status === 'Roadworthy') {
          vehicle.status = 'Under Maintenance';
          await vehicle.save();
        }
      }
    }

    await order.save();
    const populated = await WorkOrder.findById(order._id).populate('vehicle', 'regNumber make model status');

    res.status(200).json({ message: 'Work order updated', order: populated });
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