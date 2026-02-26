exports.isAdmin = (req, res, next) => {
    if (req.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            message: "Access denied: Admin rights required."
        });
    }
};

exports.isTeamOwner = (req, res, next) => {
    const userTeamId = req.teamId;
    const targetTeamId = req.body?.teamId || req.body?.team_id || req.params?.teamId || req.query?.teamId;

    if (req.role === 'admin')
        return next();

    if (req.role === 'team_principal' && userTeamId && targetTeamId && userTeamId.toString() === targetTeamId.toString()) {
        return next();
    }

    res.status(403).json({
        message: "Access denied: You are only permitted to manage your own team."
    });
};

