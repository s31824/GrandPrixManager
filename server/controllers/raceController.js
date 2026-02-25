const RaceModel = require('../models/Race');

exports.getRaces = async (req, res) => {
    try {
        const [rows] = await RaceModel.fetchAll();
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error fetching races' });
    }
};

exports.getRaceDetails = async (req, res) => {
    try {
        const [rows] = await RaceModel.findById(req.params.id);
        if (rows.length === 0) return res.status(404).json({ message: 'Race not found' });
        res.status(200).json(rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error fetching race details' });
    }
};

exports.createRace = async (req, res) => {
    const { name, date, trackId, round, raceImageUrl } = req.body;

    if (!name || !date || !trackId || !round) {
        return res.status(400).json({ message: 'Missing fields' });
    }

    try {
        const [result] = await RaceModel.create({ name, date, trackId, round, raceImageUrl });
        res.status(201).json({ message: 'Race added', id: result.insertId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error adding race' });
    }
};

exports.updateRace = async (req, res) => {
    try {
        const [result] = await RaceModel.update(req.params.id, req.body);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Race not found' });
        res.status(200).json({ message: 'Race updated' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error updating race' });
    }
};

exports.deleteRace = async (req, res) => {
    try {
        const [result] = await RaceModel.delete(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Race not found' });
        res.status(200).json({ message: 'Race deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error deleting race' });
    }
};