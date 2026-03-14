import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TeamsList = () => {
    const auth = useContext(AuthContext);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);

    const [newTeam, setNewTeam] = useState({
        name: '', base: '', teamPrincipal: '', powerUnit: '', foundedYear: '', teamImageUrl: ''
    });

    const API_URL = 'https://f1-manager-api.onrender.com/api/v1/teams';

    const fetchTeams = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                setTeams(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const activeTeams = teams.filter(t => t.is_active !== 0 && t.is_active !== false);
    const deactivatedTeams = teams.filter(t => t.is_active === 0 || t.is_active === false);

    useEffect(() => {
        const maxPage = Math.ceil(activeTeams.length / itemsPerPage);
        if (currentPage > maxPage && maxPage > 0) {
            setCurrentPage(maxPage);
        } else if (maxPage === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [activeTeams, currentPage, itemsPerPage]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to DEACTIVATE this team?')) {
            fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${auth.token}` }
            }).then(async res => {
                if (res.ok) {
                    fetchTeams();
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

    const handleRestore = (id) => {
        if (window.confirm('Are you sure you want to RESTORE this team?')) {
            fetch(`${API_URL}/${id}/restore`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${auth.token}` }
            }).then(async res => {
                if (res.ok) {
                    fetchTeams();
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

    const handleChange = (e) => setNewTeam({ ...newTeam, [e.target.name]: e.target.value });

    const handleAddTeam = (e) => {
        e.preventDefault();
        const payload = {
            ...newTeam,
            foundedYear: parseInt(newTeam.foundedYear),
            teamImageUrl: newTeam.teamImageUrl
        };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
            body: JSON.stringify(payload)
        }).then(async res => {
            if (res.ok) {
                fetchTeams();
                setNewTeam({ name: '', base: '', teamPrincipal: '', powerUnit: '', foundedYear: '', teamImageUrl: '' });
                alert("Team added!");
            } else {
                const err = await res.json();
                alert(`Error: ${err.message}`);
            }
        }).catch(err => {
            console.error('Network error:', err);
            alert('Error: Could not connect to the server.');
        });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTeams = activeTeams.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(activeTeams.length / itemsPerPage);

    const changePage = (direction) => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    if (loading) return <div className="f1-container"><p className="loading-msg">Loading Teams...</p></div>;

    return (
        <div className="f1-container">
            <h2>F1 2025 TEAMS</h2>

            {auth.isLoggedIn && auth.role === 'admin' && (
                <div className="race-form-wrapper">
                    <form className="form-grid-3-col" onSubmit={handleAddTeam}>
                        <input name="name" placeholder="Team Name" value={newTeam.name} onChange={handleChange} className="race-input" required />
                        <input name="base" placeholder="Base" value={newTeam.base} onChange={handleChange} className="race-input" required />
                        <input name="teamPrincipal" placeholder="Principal" value={newTeam.teamPrincipal} onChange={handleChange} className="race-input" required />
                        <input name="powerUnit" placeholder="Power Unit" value={newTeam.powerUnit} onChange={handleChange} className="race-input" required />
                        <input name="foundedYear" placeholder="Year" type="number" min="0" value={newTeam.foundedYear} onChange={handleChange} className="race-input" required />
                        <input name="teamImageUrl" placeholder="Car/Logo URL (https://...)" value={newTeam.teamImageUrl} onChange={handleChange} className="race-input" />

                        <button type="submit" className="btn-add-result col-span-3">ADD TEAM</button>
                    </form>
                </div>
            )}

            <div className="cards-grid-2col">
                {currentTeams.map(team => (
                    <div key={team.id} className="f1-card">

                        <div
                            className="team-bg-image"
                            style={{
                                backgroundImage: `url(${team.teamImageUrl ? team.teamImageUrl : "https://placehold.co/600x400/1a1a1a/c8102e?text=No+Image"})`
                            }}
                        ></div>

                        <div className="card-content">
                            <h3>{team.name}</h3>
                            <p className="team-name">{team.powerUnit}</p>
                            <p className="card-country">{team.base}</p>

                            <div className="card-actions">
                                <Link to={`/team/${team.id}`}>
                                    <button className="delete-btn details-btn">DETAILS</button>
                                </Link>

                                {auth.isLoggedIn && auth.role === 'admin' && (
                                    <button className="delete-btn" onClick={() => handleDelete(team.id)}>
                                        DEACTIVATE
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            {activeTeams.length === 0 && <p className="empty-list-msg">No active teams found.</p>}

            {activeTeams.length > itemsPerPage && (
                <div className="pagination-container">
                    <button className="pagination-btn" onClick={() => changePage('prev')} disabled={currentPage === 1}>&lt; PREV</button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button className="pagination-btn" onClick={() => changePage('next')} disabled={currentPage === totalPages}>NEXT &gt;</button>
                </div>
            )}

            {auth.isLoggedIn && auth.role === 'admin' && deactivatedTeams.length > 0 && (
                <div className="archive-section">
                    <h2 className="archive-title">
                        ARCHIVED TEAMS
                    </h2>
                    <div className="cards-grid-2col archive-grid">
                        {deactivatedTeams.map(team => (
                            <div key={team.id} className="f1-card">
                                <div
                                    className="team-bg-image"
                                    style={{
                                        backgroundImage: `url(${team.teamImageUrl ? team.teamImageUrl : "https://placehold.co/600x400/1a1a1a/c8102e?text=No+Image"})`
                                    }}
                                ></div>
                                <div className="card-content">
                                    <h3>{team.name} <span className="archived-label">(ARCHIVED)</span></h3>
                                    <p className="team-name">{team.powerUnit}</p>
                                    <p className="card-country">{team.base}</p>

                                    <div className="card-actions">
                                        <Link to={`/team/${team.id}`}>
                                            <button className="delete-btn details-btn">DETAILS</button>
                                        </Link>

                                        <button className="delete-btn btn-edit" onClick={() => handleRestore(team.id)}>
                                            RESTORE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamsList;