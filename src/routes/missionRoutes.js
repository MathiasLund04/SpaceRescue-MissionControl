const express = require('express');
const missionController = require('../controllers/missionController');
const {
  validateRequest,
  validateObjectIdParam
} = require('../middleware/validateRequest');
const missionValidationSchema = require('../validators/missionValidationSchema');
const assignmentValidationSchema = require('../validators/assignmentValidationSchema');

const router = express.Router();

router.get('/', missionController.getAllMissions);
router.get('/:id', validateObjectIdParam('id'), missionController.getMissionById);
router.post('/:id/assign', validateObjectIdParam('id'),
    validateRequest(assignmentValidationSchema), missionController.assignSpaceship
);
router.post('/', validateRequest(missionValidationSchema), missionController.createMission);

module.exports = router;
