const shipService = require('../services/shipService');

async function getAllShips(request, response, next) {
  try {
    const ships = await shipService.getAllShips();
    return response.status(200).json(ships);
  } catch (error) {
    return next(error);
  }
}

async function getShipById(request, response, next) {
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
  try {
    const ship = await shipService.createShip(request.body);
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
