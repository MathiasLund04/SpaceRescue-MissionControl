const Mission = require('../models/missionModel');

async function findAll() {
  return Mission.find();
}

async function findById(id) {
  return Mission.findById(id);
}

async function create(mission) {
  return Mission.create(mission);
}

module.exports = {
  findAll,
  findById,
  create
};
