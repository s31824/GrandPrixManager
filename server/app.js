const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const driverRoutes = require('./routes/driverRoutes');
const teamRoutes = require('./routes/teamRoutes');
const trackRoutes = require('./routes/trackRoutes');
const raceRoutes = require('./routes/raceRoutes');
const raceResultRoutes = require('./routes/raceResultRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 2000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/teams', teamRoutes);
app.use('/api/v1/tracks', trackRoutes);
app.use('/api/v1/races', raceRoutes);
app.use('/api/v1/race-results', raceResultRoutes);
app.use('/api/v1/auth', authRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});

app.listen(PORT, () => {
    console.log(`REST API for Drivers running on http://localhost:${PORT}/api/v1/drivers`);
    console.log(`REST API for Teams running on http://localhost:${PORT}/api/v1/teams`);
    console.log(`REST API for Teams running on http://localhost:${PORT}/api/v1/tracks`);
    console.log(`REST API for Teams running on http://localhost:${PORT}/api/v1/races`);
});