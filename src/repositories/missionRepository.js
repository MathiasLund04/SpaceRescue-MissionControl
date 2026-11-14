const Mission = require('../models/missionModel');

async function findAll() {
  return Mission.find();
}

async function findById(id, session) {
  const query = Mission.findById(id);
  return session ? query.session(session) : query;
}

async function create(mission) {
  return Mission.create(mission);
}

async function reserveForAssignment(id, session) {
  return Mission.findOneAndUpdate(
    { _id: id, status: 'pending' },
    { $set: { status: 'in progress' } },
    { new: true, session, runValidators: true }
  );
}

module.exports = {
  findAll,
  findById,
  create,
  reserveForAssignment
};
