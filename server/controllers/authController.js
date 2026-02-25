const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {

    const { email, password, role, teamId } = req.body;

    try {
        const [existingUser] = await User.findByEmail(email);
        if (existingUser.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        if (role === 'admin') {
            const [admins] = await User.findAdmin();
            if (admins.length > 0) {
                return res.status(409).json({ message: 'System already has an Administrator.' });
            }
        }

        if (role === 'team_principal') {
            if (!teamId) {
                return res.status(400).json({ message: 'Team Principal requires a teamId.' });
            }
            const [principals] = await User.findTeamPrincipal(teamId);
            if (principals.length > 0) {
                return res.status(409).json({ message: 'This team already has a Team Principal.' });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.create(email, hashedPassword, role || 'user', teamId || null);

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await User.findByEmail(email);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = users[0];

        const isEqual = await bcrypt.compare(password, user.password_hash);
        if (!isEqual) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                teamId: user.team_id
            },
            'secret_key123',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token: token,
            userId: user.id,
            role: user.role,
            teamId: user.team_id
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Login failed' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const [users] = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { email, password, role, teamId } = req.body;

    try {
        if (role === 'admin') {
            const [admins] = await User.findAdmin();
            if (admins.length > 0 && admins[0].id != userId) {
                return res.status(409).json({ message: 'System already has an Administrator.' });
            }
        }

        if (role === 'team_principal') {
            if (!teamId) {
                return res.status(400).json({ message: 'Team Principal requires a teamId.' });
            }
            const [principals] = await User.findTeamPrincipal(teamId);
            if (principals.length > 0 && principals[0].id != userId) {
                return res.status(409).json({ message: 'This team already has a Team Principal.' });
            }
        }

        let hashedPassword = null;
        if (password && password.trim() !== '') {
            hashedPassword = await bcrypt.hash(password, 12);
        }

        await User.update(userId, email, hashedPassword, role, teamId || null);
        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update user' });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await User.delete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete user' });
    }
};