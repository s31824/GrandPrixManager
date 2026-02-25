const db = require('../util/database');

module.exports = class Track {
    static fetchAll() {
        return db.execute('SELECT * FROM tracks WHERE is_active = 1 ORDER BY name ASC');
    }

    static findById(id) {
        return db.execute('SELECT * FROM tracks WHERE id = ? AND is_active = 1', [id]);
    }

    static create(track) {
        return db.execute(
            'INSERT INTO tracks (name, location, length_km, corners) VALUES (?, ?, ?, ?)',
            [track.name, track.location, track.lengthKm, track.corners]
        );
    }

    static update(id, track) {
        return db.execute(
            'UPDATE tracks SET name = ?, location = ?, length_km = ?, corners = ? WHERE id = ?',
            [track.name, track.location, track.lengthKm, track.corners, id]
        );
    }

    static deactivate(id) {
        return db.execute('UPDATE tracks SET is_active = 0 WHERE id = ?', [id]);
    }

    static hardDelete(id) {
        return db.execute('DELETE FROM tracks WHERE id = ?', [id]);
    }
};