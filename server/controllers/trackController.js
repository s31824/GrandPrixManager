const TrackModel = require('../models/Track');

exports.getTracks = async (req, res) => {
    try {
        const [rows] = await TrackModel.fetchAll();
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error fetching tracks' });
    }
};

exports.createTrack = async (req, res) => {
    const { name, location, lengthKm, corners } = req.body;
    if (!name || !location || !lengthKm || !corners) {
        return res.status(400).json({ message: 'Missing fields' });
    }
    try {
        const [result] = await TrackModel.create({ name, location, lengthKm, corners });
        res.status(201).json({ message: 'Track created', id: result.insertId });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error creating track' });
    }
};

exports.updateTrack = async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await TrackModel.update(id, req.body);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Track not found' });
        res.status(200).json({ message: 'Track updated' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error updating track' });
    }
};

exports.deactivateTrack = async (req, res) => {
    try {
        const [result] = await TrackModel.deactivate(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Track not found.' });
        res.status(200).json({ message: 'Track deactivated (Soft Delete).' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error deactivating track' });
    }
};

exports.hardDeleteTrack = async (req, res) => {
    try {
        const [result] = await TrackModel.hardDelete(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Track not found' });
        res.status(200).json({ message: 'Track PERMANENTLY deleted.' });
    } catch (err) {
        console.log(err);
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ message: 'Cannot delete: Track is used in Races.' });
        }
        res.status(500).json({ message: 'Error deleting track' });
    }
};