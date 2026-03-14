import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DriverDetails = () => {
    const auth = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [driver, setDriver] = useState(null);
    const [teams, setTeams] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [raceResults, setRaceResults] = useState([]);

    const API_BASE = 'http://f1-manager-api.onrender.com/api/v1';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const driverRes = await fetch(`${API_BASE}/drivers/${id}`);
                const driverData = await driverRes.json();
                setDriver(driverData);

                setEditFormData({
                    driverNumber: driverData.driverNumber,
                    firstName: driverData.firstName,
                    lastName: driverData.lastName,
                    team_id: driverData.team_id,
                    country: driverData.country,
                    imageUrl: driverData.image_url || driverData.imageUrl || ''
                });
                const teamsRes = await fetch(`${API_BASE}/teams`);
                setTeams(await teamsRes.json());

                fetchResults();
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id]);

    const fetchResults = () => {
        fetch(`${API_BASE}/race-results/driver/${id}`)
            .then(res => res.json())
            .then(data => setRaceResults(data));
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleSaveDriver = () => {
        fetch(`${API_BASE}/drivers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify(editFormData)
        }).then(async res => {
            if (res.ok) {
                const updated = await res.json();
                const team = teams.find(t => parseInt(t.id) === parseInt(editFormData.team_id));

                setDriver({
                    ...driver,
                    ...updated,
                    teamName: team ? team.name : "Unknown",
                    image_url: editFormData.imageUrl
                });
                setIsEditing(false);
                alert("Driver updated successfully!");
            } else {
                const err = await res.json();
                alert(`Error: ${err.message}`);
            }
        }).catch(err => {
            console.error("Network error:", err);
            alert("Error: Could not connect to the server.");
        });
    };

    const handleHardDelete = () => {
        if(window.confirm("PERMANENTLY DELETE driver?")) {
            fetch(`${API_BASE}/drivers/${id}/hard`,
                {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                })
                .then(res => {
                    if (res.ok) navigate('/');
                    else alert("Error");
                });
        }
    };

    const handleDeleteResult = (rid) => {
        if(window.confirm("Remove result?")) {
            fetch(`${API_BASE}/race-results/${rid}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${auth.token}` }
            })
                .then(() => fetchResults());
        }
    };

    if (!driver) return <div className="f1-container"><p className="loading-msg">Loading...</p></div>;

    const isAdmin = auth.role === 'admin';
    const isMyDriver = auth.role === 'team_principal' && parseInt(auth.teamId) === parseInt(driver.team_id);

    const driverImage = driver.image_url || driver.imageUrl;

    return (
        <div className="f1-container">
            <h2>Driver Details</h2>
            <div className="cards-container details-center-wrapper">
                <div className="f1-card2 driver-detail-card">
                    {isEditing ? (
                        <>
                            <h3 className="card-title-small">Edit Profile</h3>
                            <input name="firstName" value={editFormData.firstName} onChange={handleEditChange} className="edit-input" placeholder="First Name" />
                            <input name="lastName" value={editFormData.lastName} onChange={handleEditChange} className="edit-input" placeholder="Last Name" />
                            <input name="driverNumber" type="number" min="0" value={editFormData.driverNumber} onChange={handleEditChange} className="edit-input" placeholder="Number" />
                            <select name="team_id" value={editFormData.team_id} onChange={handleEditChange} className={`edit-input f1-select ${!isAdmin ? 'input-disabled' : ''}`} disabled={!isAdmin}>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <input name="country" value={editFormData.country} onChange={handleEditChange} className="edit-input" placeholder="Country" />
                            <input name="imageUrl" value={editFormData.imageUrl} onChange={handleEditChange} className="edit-input" placeholder="Image URL" />
                            <div className="edit-actions">
                                <button className="add-btn btn-save" onClick={handleSaveDriver}>SAVE</button>
                                <button className="add-btn btn-cancel" onClick={() => setIsEditing(false)}>CANCEL</button>
                            </div>
                        </>
                    ) : (
                        <>
                            {driverImage && (
                                <img
                                    src={driverImage}
                                    alt="Driver"
                                    className="detail-img"
                                />
                            )}

                            <h1 className="driver-name">{driver.firstName} {driver.lastName}</h1>
                            <hr className="driver-divider" />
                            <div className="driver-info-align">
                                <p><strong>Number:</strong> {driver.driverNumber}</p>
                                <p><strong>Team:</strong> <span className="team-name">{driver.teamName}</span></p>
                                <p><strong>Country:</strong> {driver.country}</p>
                            </div>

                            <div className="details-actions">
                                <Link to="/"><button className="btn-back">BACK</button></Link>

                                {auth.isLoggedIn && (
                                    <div className="right-actions">
                                        {(isAdmin || isMyDriver) && (
                                            <button className="delete-btn btn-edit" onClick={() => setIsEditing(true)}>EDIT</button>
                                        )}
                                        {isAdmin && (
                                            <button className="delete-btn btn-danger" onClick={handleHardDelete}>DELETE</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="results-section-wrap">
                <h2 className="section-title">Race History</h2>
                <div className="table-wrapper">
                    <table className="f1-table">
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Race</th>
                            <th>Track</th>
                            <th>Pos</th>
                            <th>Pts</th>
                            {auth.isLoggedIn && isAdmin && <th>Action</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {raceResults.map(res => (
                            <tr key={res.id}>
                                <td>{res.date.split('T')[0]}</td>
                                <td className="text-bold">{res.raceName}</td>
                                <td className="text-grey">{res.trackName}</td>
                                <td className={res.fastestLap === 1 ? 'text-purple' : (res.position===1 ? 'pos-p1' : '')}>{res.position}</td>
                                <td className="text-bold">{res.points}</td>
                                {auth.isLoggedIn && isAdmin && (
                                    <td><button className="delete-btn btn-remove" onClick={() => handleDeleteResult(res.id)}>X</button></td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DriverDetails;