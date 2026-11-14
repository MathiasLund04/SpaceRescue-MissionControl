const Spaceship = require('../models/spaceshipModel');

async function findAll() {
  return Spaceship.find();
}

async function findById(id, session) {
  const query = Spaceship.findById(id);
  return session ? query.session(session) : query;
}

async function create(spaceship) {
  return Spaceship.create(spaceship);
}

async function reserveForAssignment(id, session) {
  return Spaceship.findOneAndUpdate(
    { _id: id, status: 'available' },
    { $set: { status: 'on mission' } },
    { new: true, session, runValidators: true }
  );
}

module.exports = {
  findAll,
  findById,
  create,
  reserveForAssignment
};
