const db = require('../util/database');

module.exports = class Team {

    static fetchAll() {
        return db.execute(`
            SELECT
                id,
                name,
                base,
                team_principal AS teamPrincipal,
                power_unit AS powerUnit,
                founded_year AS foundedYear,
                team_image_url AS teamImageUrl
            FROM teams
            WHERE is_active = 1
            ORDER BY name ASC
        `);
    }

    static findById(id) {
        return db.execute(`
            SELECT
                id,
                name,
                base,
                team_principal AS teamPrincipal,
                power_unit AS powerUnit,
                founded_year AS foundedYear,
                team_image_url AS teamImageUrl
            FROM teams
            WHERE id = ? AND is_active = 1
        `, [id]);
    }

    static save(team) {
        return db.execute(
            'INSERT INTO teams (name, base, team_principal, power_unit, founded_year, team_image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [team.name, team.base, team.teamPrincipal, team.powerUnit, team.foundedYear, team.teamImageUrl]
        );
    }

    static update(id, team) {
        return db.execute(
            'UPDATE teams SET name = ?, base = ?, team_principal = ?, power_unit = ?, founded_year = ?, team_image_url = ? WHERE id = ?',
            [team.name, team.base, team.teamPrincipal, team.powerUnit, team.foundedYear, team.teamImageUrl, id]
        );
    }

    static deactivate(id) {
        return db.execute('UPDATE teams SET is_active = 0 WHERE id = ?', [id]);
    }

    static hardDelete(id) {
        return db.execute('DELETE FROM teams WHERE id = ?', [id]);
    }
};