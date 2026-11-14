const missionService = require('../services/missionService');

async function getAllMissions(request, response, next) {
  try {
    const missions = await missionService.getAllMissions();
    return response.status(200).json(missions);
  } catch (error) {
    return next(error);
  }
}

async function getMissionById(request, response, next) {
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
  try {
    const mission = await missionService.createMission(request.body);
    return response.status(201).json(mission);
  } catch (error) {
    return next(error);
  }
}

async function assignSpaceship(request, response, next) {
  try {
    const assignment = await missionService.assignSpaceshipToMission(
      request.params.id,
      request.body.spaceshipId
    );
    return response.status(201).json(assignment);
  } catch (assignmentError) {
    return next(assignmentError);
  }
}

module.exports = {
  getAllMissions,
  getMissionById,
  createMission,
  assignSpaceship
};
