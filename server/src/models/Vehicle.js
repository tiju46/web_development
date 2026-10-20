const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    regNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Roadworthy', 'Under Maintenance', 'Grounded'],
      default: 'Roadworthy',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);