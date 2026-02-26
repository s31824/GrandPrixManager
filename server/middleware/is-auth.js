const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Authentication failed: No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(500).json({ message: 'Authentication failed: Token is invalid or expired.' });
    }

    if (!decodedToken) {
        return res.status(401).json({ message: 'Authentication failed: Not authenticated.' });
    }

    req.userId = decodedToken.userId;
    req.role = decodedToken.role;
    req.teamId = decodedToken.teamId;
    next();
};