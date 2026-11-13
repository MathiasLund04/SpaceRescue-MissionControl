const Spaceship = require('../models/spaceshipModel');

async function findAll() {
  return Spaceship.find();
}

async function findById(id) {
  return Spaceship.findById(id);
}

async function create(spaceship) {
  return Spaceship.create(spaceship);
}

module.exports = {
  findAll,
  findById,
  create
};
