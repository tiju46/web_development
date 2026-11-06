const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    cost: { type: Number, required: true, default: 0, min: [0, 'Cost cannot be negative'] },
    currency: { type: String, default: 'EUR', uppercase: true },
    costInEUR: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkOrder', workOrderSchema);