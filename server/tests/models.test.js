const Vehicle = require('../src/models/Vehicle');
const WorkOrder = require('../src/models/WorkOrder');
const User = require('../src/models/User');
const mongoose = require('mongoose');

describe('Database Schema Validation Rules', () => {
  test('Vehicle model normalizes registration number to uppercase and trims whitespace', () => {
    const vehicle = new Vehicle({
      regNumber: '  181-d-45920  ',
      make: 'Toyota',
      model: 'Corolla',
      year: 2015,
      mileage: 82000,
    });

    const validationError = vehicle.validateSync();
    expect(validationError).toBeUndefined();
    expect(vehicle.regNumber).toBe('181-D-45920');
    expect(vehicle.status).toBe('Roadworthy');
  });

  test('WorkOrder model rejects negative maintenance costs', () => {
    const order = new WorkOrder({
      vehicle: new mongoose.Types.ObjectId(),
      title: 'Oil Filter Replacement',
      description: 'Routine scheduled service',
      cost: -50,
      currency: 'EUR',
      costInEUR: -50,
    });

    const validationError = order.validateSync();
    expect(validationError).toBeDefined();
    expect(validationError.errors.cost).toBeDefined();
  });

  test('User model rejects unauthorized role values and normalizes email to lowercase', () => {
    const invalidUser = new User({
      name: 'Test Staff',
      email: '  TECH@FLEETGUARD.IE ',
      password: 'hashedpassword123',
      role: 'SuperAdmin', // Not in ['Manager', 'Technician']
    });

    expect(invalidUser.email).toBe('tech@fleetguard.ie');
    const validationError = invalidUser.validateSync();
    expect(validationError.errors.role).toBeDefined();
  });
});