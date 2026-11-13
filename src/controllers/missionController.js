const mongoose = require('mongoose');
const missionService = require('../services/missionService');
const missionValidationSchema = require('../validators/missionValidationSchema');

async function getAllMissions(request, response, next) {
  try {
    const missions = await missionService.getAllMissions();
    return response.status(200).json(missions);
  } catch (error) {
    return next(error);
  }
}

async function getMissionById(request, response, next) {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(404).json({ error: 'Mission not found' });
  }

  try {
    const mission = await missionService.getMissionById(request.params.id);
    if (!mission) {
      return response.status(404).json({ error: 'Mission not found' });
    }

    return response.status(200).json(mission);
  } catch (error) {
    return next(error);
  }
}

async function createMission(request, response, next) {
  const { value, error } = missionValidationSchema.validate(request.body);
  if (error) {
    return response.status(400).json({
      error: error.details.map((detail) => detail.message)
    });
  }

  try {
    const mission = await missionService.createMission(value);
    return response.status(201).json(mission);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getAllMissions,
  getMissionById,
  createMission
};
