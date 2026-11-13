const mongoose = require('mongoose');
const shipService = require('../services/shipService');
const spaceshipValidationSchema = require('../validators/spaceshipValidationSchema');

async function getAllShips(request, response, next) {
  try {
    const ships = await shipService.getAllShips();
    return response.status(200).json(ships);
  } catch (error) {
    return next(error);
  }
}

async function getShipById(request, response, next) {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(404).json({ error: 'Spaceship not found' });
  }

  try {
    const ship = await shipService.getShipById(request.params.id);
    if (!ship) {
      return response.status(404).json({ error: 'Spaceship not found' });
    }

    return response.status(200).json(ship);
  } catch (error) {
    return next(error);
  }
}

async function createShip(request, response, next) {
  const { value, error } = spaceshipValidationSchema.validate(request.body);
  if (error) {
    return response.status(400).json({
      error: error.details.map((detail) => detail.message)
    });
  }

  try {
    const ship = await shipService.createShip(value);
    return response.status(201).json(ship);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllShips,
  getShipById,
  createShip
};
