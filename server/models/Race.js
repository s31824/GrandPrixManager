const db = require('../util/database');

module.exports = class Race {
    static fetchAll() {
        return db.execute(`
            SELECT
                r.id,
                r.name,
                r.date,
                r.round,
                r.race_image_url as raceImageUrl,
                t.name as trackName,
                r.track_id
            FROM races r
                     JOIN tracks t ON r.track_id = t.id
            ORDER BY r.date ASC
        `);
    }

    static findById(id) {
        return db.execute(`
            SELECT
                r.*,
                r.race_image_url as raceImageUrl,
                t.name as trackName
            FROM races r
                     JOIN tracks t ON r.track_id = t.id
            WHERE r.id = ?
        `, [id]);
    }

    static create(race) {
        return db.execute(
            'INSERT INTO races (name, date, track_id, round, race_image_url) VALUES (?, ?, ?, ?, ?)',
            [race.name, race.date, race.trackId, race.round, race.raceImageUrl]
        );
    }

    static update(id, race) {
        return db.execute(
            'UPDATE races SET name = ?, date = ?, track_id = ?, round = ?, race_image_url = ? WHERE id = ?',
            [race.name, race.date, race.trackId, race.round, race.raceImageUrl, id]
        );
    }

    static delete(id) {
        return db.execute('DELETE FROM races WHERE id = ?', [id]);
    }
};