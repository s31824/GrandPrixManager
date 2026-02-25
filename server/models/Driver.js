const db = require('../util/database');

module.exports = class Driver {

    static fetchAll() {
        return db.execute(`
            SELECT 
                d.id, 
                d.driver_number AS driverNumber, 
                d.first_name AS firstName, 
                d.last_name AS lastName, 
                d.country, 
                d.team_id,
                d.imageUrl,
                t.name AS teamName 
            FROM drivers d
            LEFT JOIN teams t ON d.team_id = t.id
            WHERE d.is_active = 1
        `);
    }

    static findById(id) {
        return db.execute(`
            SELECT 
                d.id, 
                d.driver_number AS driverNumber, 
                d.first_name AS firstName, 
                d.last_name AS lastName, 
                d.country, 
                d.team_id,
                d.imageUrl,
                t.name AS teamName 
            FROM drivers d
            LEFT JOIN teams t ON d.team_id = t.id
            WHERE d.id = ? AND d.is_active = 1
        `, [id]);
    }

    static findByDriverNumber(driverNumber) {
        return db.execute(
            'SELECT driver_number FROM drivers WHERE driver_number = ? AND is_active = 1',
            [driverNumber]
        );
    }

    static save(driver) {
        return db.execute(
            'INSERT INTO drivers (driver_number, first_name, last_name, team_id, country, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
            [driver.driverNumber, driver.firstName, driver.lastName, driver.team_id, driver.country, driver.imageUrl]
        );
    }

    static update(id, driver) {
        return db.execute(
            'UPDATE drivers SET driver_number = ?, first_name = ?, last_name = ?, team_id = ?, country = ?, imageUrl=? WHERE id = ?',
            [driver.driverNumber, driver.firstName, driver.lastName, driver.team_id, driver.country, driver.imageUrl, id]
        );
    }

    static deactivate(id) {
        return db.execute(
            'UPDATE drivers SET is_active = 0, driver_number = NULL WHERE id = ?',
            [id]
        );
    }

    static hardDelete(id) {
        return db.execute('DELETE FROM drivers WHERE id = ?', [id]);
    }
};

