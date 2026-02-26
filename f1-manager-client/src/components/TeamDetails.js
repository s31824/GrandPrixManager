import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TeamDetails = () => {
    const auth = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [team, setTeam] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});

    const API_URL = `http://127.0.0.1:2000/api/v1/teams/${id}`;

    useEffect(() => {
        fetch(API_URL).then(res => res.json()).then(data => { setTeam(data); setEditFormData(data); });
    }, [id]);

    const handleEditChange = (e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value });

    const handleSave = () => {
        fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
            body: JSON.stringify({ ...editFormData, foundedYear: parseInt(editFormData.foundedYear) })
        }).then(async res => {
            if(res.ok) {
                setTeam(editFormData);
                setIsEditing(false);
                alert("Team updated!");
            } else {
                const err = await res.json();
                alert(`Error: ${err.message}`);
            }
        }).catch(err => {
            console.error('Network error:', err);
            alert('Error: Could not connect to the server.');
        });
    };

    const handleHardDelete = () => {
        if(window.confirm("PERMANENTLY DELETE TEAM?")) {
            fetch(`${API_URL}/hard`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${auth.token}` }
            }).then(async res => {
                if(res.ok) {
                    navigate('/teams');
                } else {
                    const err = await res.json();
                    alert(`Error: ${err.message}`);
                }
            }).catch(err => {
                console.error('Network error:', err);
                alert('Error: Could not connect to the server.');
            });
        }
    };

    if (!team) return <div className="f1-container"><p className="loading-msg">Loading...</p></div>;

    const isMyTeam = auth.role === 'team_principal' && parseInt(auth.teamId) === parseInt(id);
    const canEdit = (auth.role === 'admin') || isMyTeam;
    const canDelete = auth.role === 'admin';

    return (
        <div className="f1-container">
            <h2>Team Details</h2>
            <div className="cards-container details-center-wrapper">
                <div className="f1-card2 driver-detail-card">
                    {isEditing ? (
                        <>
                            <h3 className="card-title-small">Edit Team</h3>
                            <input name="name" value={editFormData.name} onChange={handleEditChange} className="edit-input" placeholder="Name" />
                            <input name="base" value={editFormData.base} onChange={handleEditChange} className="edit-input" placeholder="Base" />
                            <input name="teamPrincipal" value={editFormData.teamPrincipal} onChange={handleEditChange} className="edit-input" placeholder="Principal" />
                            <input name="powerUnit" value={editFormData.powerUnit} onChange={handleEditChange} className="edit-input" placeholder="Power Unit" />
                            <input name="foundedYear" type="number" value={editFormData.foundedYear} onChange={handleEditChange} className="edit-input" placeholder="Year" />
                            <input name="teamImageUrl" value={editFormData.teamImageUrl} onChange={handleEditChange} className="edit-input" placeholder="Image URL" />

                            <div className="edit-actions">
                                <button className="add-btn btn-save" onClick={handleSave}>SAVE</button>
                                <button className="add-btn btn-cancel" onClick={() => setIsEditing(false)}>CANCEL</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="driver-name">{team.name}</h1>

                            {team.teamImageUrl && (
                                <img src={team.teamImageUrl} alt="Car" className="detail-img" />
                            )}

                            <hr className="driver-divider" />
                            <div className="driver-info-align">
                                <p><strong>Base:</strong> {team.base}</p>
                                <p><strong>Principal:</strong> {team.teamPrincipal}</p>
                                <p><strong>Power Unit:</strong> {team.powerUnit}</p>
                                <p><strong>Founded:</strong> {team.foundedYear}</p>
                            </div>

                            <div className="details-actions">
                                {!isMyTeam && (
                                    <Link to="/teams"><button className="btn-back">BACK</button></Link>
                                )}

                                {auth.isLoggedIn && (
                                    <div className="right-actions">
                                        {canEdit && (
                                            <button className="delete-btn btn-edit" onClick={() => setIsEditing(true)}>EDIT</button>
                                        )}

                                        {canDelete && (
                                            <button className="delete-btn btn-danger" onClick={handleHardDelete}>DELETE</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamDetails;