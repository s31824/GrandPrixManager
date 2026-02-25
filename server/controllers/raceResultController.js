const RaceResultModel = require('../models/RaceResult');
const DriverModel = require('../models/Driver');

exports.getResultsByRace = async (req, res) => {
    const raceId = req.params.raceId;
    try {
        const [rows] = await RaceResultModel.fetchByRaceId(raceId);
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch race results.' });
    }
};

exports.getResultsByDriver = async (req, res) => {
    const driverId = req.params.driverId;
    try {
        const [rows] = await RaceResultModel.fetchByDriverId(driverId);
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to fetch driver results.' });
    }
};

exports.addResult = async (req, res) => {
    const raceId = req.body.raceId || req.body.race_id;
    const driverId = req.body.driverId || req.body.driver_id;
    const { position, points, fastestLap } = req.body;

    if (!raceId || !driverId || !position || points === undefined) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const [duplicates] = await RaceResultModel.checkDuplicate(raceId, driverId);
        if (duplicates.length > 0) {
            return res.status(409).json({ message: 'This driver already has a result in this race.' });
        }

        const [posCheck] = await RaceResultModel.checkPositionTaken(raceId, position);
        if (posCheck.length > 0) {
            return res.status(409).json({ message: `Position ${position} is already taken.` });
        }

        if (fastestLap) {
            const [flCheck] = await RaceResultModel.checkFastestLapTaken(raceId);
            if (flCheck.length > 0) {
                return res.status(409).json({ message: 'Fastest Lap is already assigned to another driver!' });
            }
        }

        const [driverData] = await DriverModel.findById(driverId);
        if (driverData.length === 0) {
            return res.status(404).json({ message: 'Driver not found.' });
        }
        const historicalTeamId = driverData[0].team_id;

        const resultData = {
            raceId,
            driverId,
            teamId: historicalTeamId,
            position,
            points,
            fastestLap: fastestLap ? 1 : 0
        };

        const [saveResult] = await RaceResultModel.create(resultData);

        res.status(201).json({
            message: 'Result added successfully',
            id: saveResult.insertId,
            ...resultData
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error while adding result.' });
    }
};

exports.updateResult = async (req, res) => {
    const id = req.params.id;
    const { position, points, fastestLap } = req.body;
    try {
        const updateData = { position, points, fastestLap: fastestLap ? 1 : 0 };
        const [result] = await RaceResultModel.update(id, updateData);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Result not found.' });
        res.status(200).json({ message: 'Result updated.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update result.' });
    }
};

exports.deleteResult = async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await RaceResultModel.delete(id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Result not found.' });
        res.status(200).json({ message: 'Result deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete result.' });
    }
};