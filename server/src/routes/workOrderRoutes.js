const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getAllWorkOrders,
  createWorkOrder,
  updateWorkOrderStatus,
  deleteWorkOrder,
} = require('../controllers/workOrderController');
const { authenticate, requireManager } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.use(authenticate);

// View work orders
router.get('/', getAllWorkOrders);

// Manager creates work order
router.post(
  '/',
  requireManager,
  [
    body('vehicleId').isMongoId().withMessage('Valid Vehicle ID required'),
    body('title').trim().notEmpty().withMessage('Title required'),
    body('description').trim().notEmpty().withMessage('Description required'),
    validate,
  ],
  createWorkOrder
);

// Update status (Managers and Technicians)
router.put('/:id', updateWorkOrderStatus);

// Manager deletes work order
router.delete('/:id', requireManager, deleteWorkOrder);

module.exports = router;