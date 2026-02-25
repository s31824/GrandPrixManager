import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RaceDetails = () => {
    const auth = useContext(AuthContext);
    const { id } = useParams();

    const [race, setRace] = useState(null);
    const [results, setResults] = useState([]);
    const [allDrivers, setAllDrivers] = useState([]);

    const [newResult, setNewResult] = useState({ driverId: '', position: '', fastestLap: false });
    const API_BASE = 'http://127.0.0.1:2000/api/v1';

    useEffect(() => {
        fetch(`${API_BASE}/races/${id}`).then(res => res.json()).then(data => setRace(data));
        fetchResults();
        fetch(`${API_BASE}/drivers`).then(res => res.json()).then(data => setAllDrivers(data));
    }, [id]);

    const fetchResults = () => {
        fetch(`${API_BASE}/race-results/race/${id}`).then(res => res.json()).then(data => setResults(data));
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setNewResult({ ...newResult, [e.target.name]: value });
    };

    const handleAddResult = (e) => {
        e.preventDefault();
        const selectedDriver = allDrivers.find(d => d.id == newResult.driverId);
        if (!selectedDriver) { alert("Select driver"); return; }
        const p = parseInt(newResult.position);
        const pointsSystem = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
        let calculatedPoints = pointsSystem[p - 1] || 0;
        if (newResult.fastestLap && p <= 10) calculatedPoints += 1;

        const payload = {
            raceId: id, driverId: parseInt(newResult.driverId),
            teamId: selectedDriver.team_id, position: p,
            points: calculatedPoints, fastestLap: newResult.fastestLap
        };

        fetch(`${API_BASE}/race-results`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        }).then(async res => {
            if (res.ok) { fetchResults(); setNewResult({ driverId: '', position: '', fastestLap: false }); }
            else { const err = await res.json(); alert(err.message); }
        });
    };

    const handleDelete = (resultId) => {
        if(window.confirm("Remove?")) fetch(`${API_BASE}/race-results/${resultId}`, { method: 'DELETE' }).then(res => { if(res.ok) fetchResults(); });
    };

    if (!race) return <div className="f1-container"><p className="loading-msg">Loading...</p></div>;
    const raceYear = new Date(race.date).getFullYear().toString();

    return (
        <div className="f1-container">
            <h2>{race.name} Results</h2>
            <p className="race-subtitle">{new Date(race.date).toLocaleDateString()} | {race.trackName}</p>

            {auth.isLoggedIn && auth.role === 'admin' && (
                <div className="race-form-wrapper">
                    <form onSubmit={handleAddResult} className="race-grid">
                        <div className="col-span-1">
                            <select name="driverId" value={newResult.driverId} onChange={handleChange} className="race-select" required>
                                <option value="" disabled>Select Driver...</option>
                                {allDrivers.map(d => (
                                    <option key={d.id} value={d.id}>#{d.driverNumber} {d.firstName} {d.lastName}</option>
                                ))}
                            </select>
                        </div>
                        <input name="position" type="number" min="1" placeholder="Pos" value={newResult.position} onChange={handleChange} className="race-input" required />
                        <label className={`fl-checkbox-wrapper ${newResult.fastestLap ? 'active' : ''}`}>
                            <input type="checkbox" name="fastestLap" checked={newResult.fastestLap} onChange={handleChange} />
                            <span className="fl-label-text">{newResult.fastestLap ? "FASTEST LAP!" : "Fastest Lap?"}</span>
                        </label>
                        <button type="submit" className="btn-add-result">ADD RESULT</button>
                    </form>
                </div>
            )}

            <div className="table-wrapper">
                <table className="f1-table">
                    <thead>
                    <tr>
                        <th>Pos</th>
                        <th>No.</th>
                        <th>Driver</th>
                        <th>Team</th>
                        <th>Points</th>
                        {auth.isLoggedIn && auth.role === 'admin' && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {results.length > 0 ? results.map((res) => (
                        <tr key={res.id}>
                            <td className={res.position === 1 ? 'pos-p1' : ''}>{res.position}</td>
                            <td className={res.fastestLap === 1 ? 'text-purple' : 'text-grey'}>#{res.driverNumber}</td>
                            <td className="text-bold">{res.driverFirstName} {res.driverLastName}</td>
                            <td>{res.teamName}</td>
                            <td className="text-red">{res.points}</td>

                            {auth.isLoggedIn && auth.role === 'admin' && (
                                <td><button className="delete-btn btn-remove" onClick={() => handleDelete(res.id)}>Remove</button></td>
                            )}
                        </tr>
                    )) : (<tr><td colSpan="6" className="text-grey">No results added yet.</td></tr>)}
                    </tbody>
                </table>
            </div>

            <div className="back-btn-wrapper">
                <Link to="/races" state={{ season: raceYear }}>
                    <button className="btn-back">Back to Calendar</button>
                </Link>
            </div>
        </div>
    );
};

export default RaceDetails;