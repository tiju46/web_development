const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { authenticate, requireManager } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// All vehicle operations require login
router.use(authenticate);

// Both Managers and Technicians can view the fleet
router.get('/', getAllVehicles);

// Only Managers can add vehicles
router.post(
  '/',
  requireManager,
  [
    body('regNumber').trim().notEmpty().withMessage('Registration number required'),
    body('make').trim().notEmpty().withMessage('Make is required'),
    body('model').trim().notEmpty().withMessage('Model is required'),
    body('year').isInt({ min: 1990 }).withMessage('Valid year required'),
    body('mileage').isNumeric().withMessage('Mileage must be a number'),
    validate,
  ],
  createVehicle
);

// Both Manager and Technician can update mileage/status
router.put('/:id', updateVehicle);

// Only Managers can delete vehicles
router.delete('/:id', requireManager, deleteVehicle);

module.exports = router;