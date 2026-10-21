const Vehicle = require('../models/Vehicle');

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve vehicles', details: err.message });
  }
};

// Add a new vehicle (Manager only)
exports.createVehicle = async (req, res) => {
  try {
    const { regNumber, make, model, year, mileage, status } = req.body;

    const existing = await Vehicle.findOne({ regNumber: regNumber.toUpperCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'A vehicle with this registration already exists' });
    }

    const vehicle = await Vehicle.create({
      regNumber: regNumber.toUpperCase().trim(),
      make,
      model,
      year,
      mileage,
      status: status || 'Roadworthy',
    });

    res.status(201).json({ message: 'Vehicle added successfully', vehicle });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create vehicle', details: err.message });
  }
};

// Update vehicle (mileage or status)
exports.updateVehicle = async (req, res) => {
  try {
    const { mileage, status } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (mileage !== undefined) vehicle.mileage = mileage;
    if (status) vehicle.status = status;

    const updated = await vehicle.save();
    res.status(200).json({ message: 'Vehicle updated', vehicle: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update vehicle', details: err.message });
  }
};

// Delete vehicle (Manager only)
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle deleted from fleet' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete vehicle', details: err.message });
  }
};