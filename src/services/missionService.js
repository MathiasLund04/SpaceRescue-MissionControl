const missionRepository = require('../repositories/missionRepository');

async function getAllMissions() {
  return missionRepository.findAll();
}

async function getMissionById(id) {
  return missionRepository.findById(id);
}

async function createMission(mission) {
  return missionRepository.create(mission);
}

module.exports = {
  getAllMissions,
  getMissionById,
  createMission
};
