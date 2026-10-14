const mongoose = require('mongoose');

const workOrderSchema = new mongoose.Schema(
  {
    vehicleId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Vehicle', 
      required: true 
    },
    assignedVendorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    title: { 
      type: String, 
      required: true, 
      trim: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Created', 'In-Progress', 'Completed', 'Invoiced'],
      default: 'Created',
    },
    rawCost: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    rawCurrency: { 
      type: String, 
      default: 'EUR', 
      uppercase: true 
    },
    normalizedCostEUR: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    resolutionNotes: { 
      type: String, 
      default: '' 
    },
  },
  { timestamps: true }
);
