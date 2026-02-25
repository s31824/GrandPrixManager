const TeamModel = require('../models/Team');

exports.getTeams = async (req, res) => {
    try {
        const [rows] = await TeamModel.fetchAll();
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to retrieve teams.' });
    }
};

exports.getTeamDetails = async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await TeamModel.findById(id);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Team not found.' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to retrieve team details.' });
    }
};

exports.createTeam = async (req, res) => {
    const { name, base, teamPrincipal, powerUnit, foundedYear, teamImageUrl } = req.body;

    if (!name || !base || !teamPrincipal || !powerUnit || !foundedYear) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const [result] = await TeamModel.save(req.body);
        res.status(201).json({
            id: result.insertId,
            name, base, teamPrincipal, powerUnit, foundedYear, teamImageUrl
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to create team.' });
    }
};

exports.updateTeam = async (req, res) => {
    const id = req.params.id;
    const { name, base, teamPrincipal, powerUnit, foundedYear, teamImageUrl } = req.body;

    if (!name || !base || !teamPrincipal || !powerUnit || !foundedYear) {
        return res.status(400).json({ message: 'Missing required fields for update.' });
    }

    try {
        const [result] = await TeamModel.update(id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Team not found.' });
        }
        res.status(200).json({ id: parseInt(id), ...req.body });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to update team.' });
    }
};

exports.deactivateTeam = async (req, res) => {
    try {
        const [result] = await TeamModel.deactivate(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Team not found.' });
        res.status(200).json({ message: 'Team deactivated (Soft Delete).' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to deactivate team.' });
    }
};

exports.hardDeleteTeam = async (req, res) => {
    try {
        const [result] = await TeamModel.hardDelete(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Team not found.' });
        res.status(200).json({ message: 'Team PERMANENTLY deleted.' });
    } catch (err) {
        console.log(err);
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ message: 'Cannot delete: Team has drivers or race results.' });
        }
        res.status(500).json({ message: 'Failed to delete team.' });
    }
};