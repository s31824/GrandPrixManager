const db = require('../util/database');

module.exports = class RaceResult {

    static fetchByRaceId(raceId) {
        return db.execute(`
            SELECT
                rr.id, rr.race_id, rr.driver_id, rr.team_id, rr.position, rr.points, rr.fastest_lap AS fastestLap,
                d.first_name AS driverFirstName, d.last_name AS driverLastName, d.driver_number AS driverNumber,
                t.name AS teamName,
                r.name AS raceName, r.date AS raceDate
            FROM race_results rr
                     JOIN drivers d ON rr.driver_id = d.id
                     JOIN teams t ON rr.team_id = t.id
                     JOIN races r ON rr.race_id = r.id
            WHERE rr.race_id = ?
            ORDER BY rr.position ASC
        `, [raceId]);
    }

    static fetchByDriverId(driverId) {
        return db.execute(`
            SELECT
                rr.id, rr.position, rr.points, rr.fastest_lap AS fastestLap,
                r.name AS raceName, r.date,
                t.name AS trackName
            FROM race_results rr
                     JOIN races r ON rr.race_id = r.id
                     JOIN tracks t ON r.track_id = t.id
            WHERE rr.driver_id = ?
            ORDER BY r.date DESC
        `, [driverId]);
    }

    static findById(id) {
        return db.execute('SELECT * FROM race_results WHERE id = ?', [id]);
    }

    static checkDuplicate(raceId, driverId) {
        return db.execute(
            'SELECT id FROM race_results WHERE race_id = ? AND driver_id = ?',
            [raceId, driverId]
        );
    }

    static checkPositionTaken(raceId, position) {
        return db.execute(
            'SELECT id FROM race_results WHERE race_id = ? AND position = ?',
            [raceId, position]
        );
    }

    static checkFastestLapTaken(raceId) {
        return db.execute(
            'SELECT id FROM race_results WHERE race_id = ? AND fastest_lap = 1',
            [raceId]
        );
    }

    static create(data) {
        return db.execute(
            'INSERT INTO race_results (race_id, driver_id, team_id, position, points, fastest_lap) VALUES (?, ?, ?, ?, ?, ?)',
            [data.raceId, data.driverId, data.teamId, data.position, data.points, data.fastestLap]
        );
    }

    static update(id, data) {
        return db.execute(
            'UPDATE race_results SET position = ?, points = ?, fastest_lap = ? WHERE id = ?',
            [data.position, data.points, data.fastestLap, id]
        );
    }

    static delete(id) {
        return db.execute('DELETE FROM race_results WHERE id = ?', [id]);
    }
};