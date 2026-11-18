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

});