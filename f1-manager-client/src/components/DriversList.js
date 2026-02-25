import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DriversList = () => {
    const auth = useContext(AuthContext);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [groupedDrivers, setGroupedDrivers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(2);

    const [newDriver, setNewDriver] = useState({
        driverNumber: '',
        firstName: '',
        lastName: '',
        team_id: auth.role === 'team_principal' ? auth.teamId : '',
        country: '',
        imageUrl: ''
    });

    const API_BASE = 'http://127.0.0.1:2000/api/v1';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [driversRes, teamsRes] = await Promise.all([
                    fetch(`${API_BASE}/drivers`),
                    fetch(`${API_BASE}/teams`)
                ]);
                const driversData = await driversRes.json();
                const teamsData = await teamsRes.json();

                setTeams(teamsData);

                let teamsToProcess = teamsData;
                if (auth.role === 'team_principal' && auth.teamId) {
                    teamsToProcess = teamsData.filter(t => t.id === auth.teamId);
                }

                const grouped = teamsToProcess.map(team => ({
                    ...team,
                    drivers: driversData.filter(d => d.team_id === team.id)
                }));

                if (auth.role !== 'team_principal') {
                    const freeAgents = driversData.filter(d => !d.team_id || d.team_id === 0);
                    if (freeAgents.length > 0) {
                        grouped.push({ id: 0, name: "Free Agents", base: "N/A", drivers: freeAgents });
                    }
                }

                setGroupedDrivers(grouped);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, [auth.role, auth.teamId]);

    const handleDeactivate = (id) => {
        if (window.confirm('Are you sure you want to DEACTIVATE this driver?')) {
            fetch(`${API_BASE}/drivers/${id}`, { method: 'DELETE' })
                .then(res => { if (res.ok) window.location.reload(); });
        }
    };

    const handleChange = (e) => setNewDriver({ ...newDriver, [e.target.name]: e.target.value });

    const handleAddDriver = (e) => {
        e.preventDefault();

        let finalTeamId;
        if (auth.role === 'team_principal' && auth.teamId) {
            finalTeamId = auth.teamId;
        } else {
            finalTeamId = newDriver.team_id || (teams.length > 0 ? teams[0].id : 0);
        }

        const payload = {
            ...newDriver,
            driverNumber: parseInt(newDriver.driverNumber),
            team_id: parseInt(finalTeamId),
            imageUrl: newDriver.imageUrl
        };

        fetch(`${API_BASE}/drivers`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        }).then(async res => {
            if (res.ok) { window.location.reload(); alert("Driver added!"); }
            else { const err = await res.json(); alert(`Error: ${err.message}`); }
        });
    };

    const activeGroups = groupedDrivers.filter(g => g.drivers.length > 0);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentGroups = activeGroups.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(activeGroups.length / itemsPerPage);

    const changePage = (direction) => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const getMyTeamName = () => {
        const myTeam = teams.find(t => t.id === auth.teamId);
        return myTeam ? myTeam.name : 'My Team';
    };

    if (loading) return <div className="f1-container"><p className="loading-msg">Loading Grid...</p></div>;

    return (
        <div className="f1-container">
            <h2>{auth.role === 'team_principal' ? 'My Drivers' : 'F1 2025 Grid'}</h2>

            {auth.isLoggedIn && (
                <div className="race-form-wrapper">
                    <form className="form-grid-3-col" onSubmit={handleAddDriver}>
                        <input name="driverNumber" placeholder="Number" type="number" min="0" value={newDriver.driverNumber} onChange={handleChange} className="race-input" required />
                        <input name="firstName" placeholder="First Name" value={newDriver.firstName} onChange={handleChange} className="race-input" required />
                        <input name="lastName" placeholder="Last Name" value={newDriver.lastName} onChange={handleChange} className="race-input" required />

                        {auth.role === 'team_principal' ? (
                            <input
                                type="text"
                                value={getMyTeamName()}
                                disabled
                                className="race-input input-disabled"
                            />
                        ) : (
                            <select name="team_id" value={newDriver.team_id} onChange={handleChange} className="race-select" required>
                                <option value="" disabled>Select Team...</option>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        )}


                        <input name="country" placeholder="Country" value={newDriver.country} onChange={handleChange} className="race-input" required />
                        <input name="imageUrl" placeholder="Photo URL (https://...)" value={newDriver.imageUrl} onChange={handleChange} className="race-input" />

                        <button type="submit" className="btn-add-result col-span-3">ADD DRIVER</button>
                    </form>
                </div>
            )}

            <div className="team-rows-container">
                {currentGroups.map(teamGroup => (
                    <div key={teamGroup.id} className="team-row">
                        <div className="team-info-box">
                            <h3>{teamGroup.name}</h3>
                            <p className="card-country">{teamGroup.base}</p>
                        </div>
                        <div className="drivers-pair-container">
                            {teamGroup.drivers.map(driver => (
                                <div key={driver.id} className="driver-card-rect">
                                    <div className="driver-rect-content">
                                        <span className="driver-rect-number">{driver.driverNumber}</span>
                                        <div className="driver-rect-name">
                                            <span className="driver-rect-firstname">{driver.firstName}</span>
                                            <span className="driver-rect-lastname">{driver.lastName}</span>
                                            <p className="driver-rect-country">{driver.country}</p>
                                        </div>
                                    </div>
                                    <div className="driver-photo-wrapper">
                                        <img
                                            src={driver.imageUrl ? driver.imageUrl : "https://placehold.co/200x300/1a1a1a/c8102e?text=No+Photo"}
                                            alt={driver.lastName}
                                            className="driver-real-photo"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src="https://placehold.co/200x300/1a1a1a/c8102e?text=Image+Error";
                                            }}
                                        />
                                    </div>
                                    <div className="driver-rect-actions">
                                        <Link to={`/driver/${driver.id}`}>
                                            <button className="delete-btn details-btn btn-xs">INFO</button>
                                        </Link>
                                        {auth.isLoggedIn && (
                                            <button className="delete-btn btn-xs" onClick={() => handleDeactivate(driver.id)}>X</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {activeGroups.length > itemsPerPage && (
                <div className="pagination-container">
                    <button className="pagination-btn" onClick={() => changePage('prev')} disabled={currentPage === 1}>&lt; PREV</button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button className="pagination-btn" onClick={() => changePage('next')} disabled={currentPage === totalPages}>NEXT &gt;</button>
                </div>
            )}
        </div>
    );
};

export default DriversList;