const DriverModel = require('../models/Driver');

exports.getDrivers = async (req, res) => {
    try {
        const [rows] = await DriverModel.fetchAll();
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to retrieve drivers list.' });
    }
};

exports.getDriverDetails = async (req, res) => {
    try {
        const [rows] = await DriverModel.findById(req.params.id);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Driver not found.' });
        }
        res.status(200).json(rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to retrieve driver details.' });
    }
};

exports.createDriver = async (req, res) => {
    const { driverNumber, firstName, lastName, team_id, country, imageUrl } = req.body;

    if (!driverNumber || !firstName || !lastName || !team_id || !country) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        const [existing] = await DriverModel.findByDriverNumber(driverNumber);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Driver number already exists.' });
        }

        const driverData = {
            driverNumber, firstName, lastName, team_id, country,
            imageUrl: imageUrl || null
        };

        const [result] = await DriverModel.save(driverData);

        res.status(201).json({
            id: result.insertId,
            ...driverData
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to create driver due to server error.' });
    }
};

exports.updateDriver = async (req, res) => {
    const id = req.params.id;
    const { driverNumber, firstName, lastName, team_id, country, imageUrl } = req.body;

    if (!driverNumber || !firstName || !lastName || !team_id || !country) {
        return res.status(400).json({ message: 'Missing fields for update.' });
    }

    try {
        const driverData = {
            driverNumber, firstName, lastName, team_id, country,
            imageUrl: imageUrl || null
        };

        const [result] = await DriverModel.update(id, driverData);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Driver not found.' });
        }

        res.status(200).json({
            id: parseInt(id),
            ...driverData
        });
    } catch (err) {
        console.log(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Driver number already taken.' });
        }
        res.status(500).json({ message: 'Failed to update driver.' });
    }
};

exports.deactivateDriver = async (req, res) => {
    try {
        const [result] = await DriverModel.deactivate(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Driver not found.' });
        res.status(200).json({ message: 'Driver deactivated (Soft Delete).' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to deactivate driver.' });
    }
};

exports.hardDeleteDriver = async (req, res) => {
    try {
        const [result] = await DriverModel.hardDelete(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Driver not found.' });
        res.status(200).json({ message: 'Driver PERMANENTLY deleted from database.' });
    } catch (err) {
        console.log(err);
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({ message: 'Cannot delete: Driver has associated race results.' });
        }
        res.status(500).json({ message: 'Failed to delete driver.' });
    }
};

exports.restoreDriver = async (req, res) => {
    try {
        const [result] = await DriverModel.restore(req.params.id);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Driver not found.' });
        res.status(200).json({ message: 'Driver successfully restored.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Failed to restore driver.' });
    }
};