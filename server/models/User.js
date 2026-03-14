const db = require('../util/database');

module.exports = class User {
    static findByEmail(email) {
        return db.execute('SELECT * FROM users WHERE email = ?', [email]);
    }

    static findAdmin() {
        return db.execute('SELECT * FROM users WHERE role = ?', ['admin']);
    }

    static findTeamPrincipal(teamId) {
        return db.execute(
            'SELECT * FROM users WHERE role = ? AND team_id = ?',
            ['team_principal', teamId]
        );
    }

    static create(email, passwordHash, role, teamId) {
        return db.execute(
            'INSERT INTO users (email, password_hash, role, team_id) VALUES (?, ?, ?, ?)',
            [email, passwordHash, role, teamId]
        );
    }

    static findAll() {
        return db.execute('SELECT id, email, role, team_id FROM users');
    }

    static update(id, email, passwordHash, role, teamId) {
        if (passwordHash) {
            return db.execute(
                'UPDATE users SET email = ?, password_hash = ?, role = ?, team_id = ? WHERE id = ?',
                [email, passwordHash, role, teamId, id]
            );
        } else {
            return db.execute(
                'UPDATE users SET email = ?, role = ?, team_id = ? WHERE id = ?',
                [email, role, teamId, id]
            );
        }
    }

    static delete(id) {
        return db.execute('DELETE FROM users WHERE id = ?', [id]);
    }
};