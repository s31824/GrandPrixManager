const User = require('../models/User');
const TeamModel = require('../models/Team');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.createUser = async (req, res) => {
    const { email, password, role, teamId } = req.body;

    try {
        const [existingUser] = await User.findByEmail(email);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Registration failed: Email already exists.' });
        }

        if (role === 'admin') {
            const [admins] = await User.findAdmin();
            if (admins.length > 0) {
                return res.status(409).json({ message: 'Registration failed: System already has an Administrator.' });
            }
        }

        if (role === 'team_principal') {
            if (!teamId) {
                return res.status(400).json({ message: 'Registration failed: Team Principal requires a teamId.' });
            }
            const [principals] = await User.findTeamPrincipal(teamId);
            if (principals.length > 0) {
                return res.status(409).json({ message: 'Registration failed: This team already has a Team Principal.' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.create(email, hashedPassword, role || 'user', teamId || null);

        res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error: Failed to create user.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await User.findByEmail(email);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Authentication failed: Invalid email or password.' });
        }

        const user = users[0];
        const isEqual = await bcrypt.compare(password, user.password_hash);
        if (!isEqual) {
            return res.status(401).json({ message: 'Authentication failed: Invalid email or password.' });
        }

        if (user.role === 'team_principal' && user.team_id) {
            const [teamRows] = await TeamModel.findById(user.team_id);
            if (teamRows.length > 0 && (teamRows[0].is_active === 0 || teamRows[0].is_active === false)) {
                return res.status(403).json({
                    message: 'Access denied: Your team has been archived. Please contact the Administrator.'
                });
            }
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                teamId: user.team_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token: token,
            userId: user.id,
            role: user.role,
            teamId: user.team_id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error: Login failed.' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const [users] = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error: Failed to fetch users.' });
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { email, password, role, teamId } = req.body;

    try {
        if (req.role !== 'admin' && req.userId.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Access denied: You can only update your own profile.' });
        }

        if (role === 'admin') {
            const [admins] = await User.findAdmin();
            if (admins.length > 0 && admins[0].id != userId) {
                return res.status(409).json({ message: 'Update failed: System already has an Administrator.' });
            }
        }

        if (role === 'team_principal') {
            if (!teamId) {
                return res.status(400).json({ message: 'Update failed: Team Principal requires a teamId.' });
            }
            const [principals] = await User.findTeamPrincipal(teamId);
            if (principals.length > 0 && principals[0].id != userId) {
                return res.status(409).json({ message: 'Update failed: This team already has a Team Principal.' });
            }
        }

        let hashedPassword = null;
        if (password && password.trim() !== '') {
            hashedPassword = await bcrypt.hash(password, 12);
        }

        await User.update(userId, email, hashedPassword, role, teamId || null);
        res.status(200).json({ message: 'User updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error: Failed to update user.' });
    }
};

exports.deleteUser = async (req, res) => {
    const targetUserId = req.params.id;

    try {
        if (req.role !== 'admin' && req.userId.toString() !== targetUserId.toString()) {
            return res.status(403).json({ message: 'Access denied: You do not have permission to delete this user.' });
        }

        await User.delete(targetUserId);
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error: Failed to delete user.' });
    }
};