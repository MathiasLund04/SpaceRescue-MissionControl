const express = require('express');
const shipController = require('../controllers/shipController');
const {
  validateRequest,
  validateObjectIdParam
} = require('../middleware/validateRequest');
const spaceshipValidationSchema = require('../validators/spaceshipValidationSchema');

const router = express.Router();

router.get('/', shipController.getAllShips);
router.get('/:id', validateObjectIdParam('id'), shipController.getShipById);
router.post('/', validateRequest(spaceshipValidationSchema), shipController.createShip);

module.exports = router;
