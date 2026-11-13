const express = require('express');
const morgan = require('morgan');
const shipRoutes = require('./routes/shipRoutes');
const missionRoutes = require('./routes/missionRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/ships', shipRoutes);
app.use('/api/missions', missionRoutes);
app.use(errorHandler);

module.exports = app;
