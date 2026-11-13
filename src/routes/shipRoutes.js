const express = require('express');
const shipController = require('../controllers/shipController');

const router = express.Router();

router.get('/', shipController.getAllShips);
router.get('/:id', shipController.getShipById);
router.post('/', shipController.createShip);

module.exports = router;
