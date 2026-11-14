const Joi = require("joi");

const assignmentValidationSchema = Joi.object({
    spaceshipId: Joi.string().hex().length(24).required()
}).required().prefs({ abortEarly: false });

module.exports = assignmentValidationSchema;