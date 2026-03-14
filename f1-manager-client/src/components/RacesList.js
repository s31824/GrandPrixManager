import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RacesList = () => {
    const auth = useContext(AuthContext);
    const [races, setRaces] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    // ------------------------

    const [newRace, setNewRace] = useState({
        name: '', date: '', trackId: '', round: '', raceImageUrl: ''
    });

    const location = useLocation();
    const API_URL = 'http://f1-manager-api.onrender.com/api/v1/races';
    const TRACKS_URL = 'http://f1-manager-api.onrender.com/api/v1/tracks';

    useEffect(() => {
        fetchData();
    }, [location.state]);

    const fetchData = async () => {
        try {
            const [racesRes, tracksRes] = await Promise.all([
                fetch(API_URL),
                fetch(TRACKS_URL)
            ]);

            const racesData = await racesRes.json();
            const tracksData = await tracksRes.json();

            setRaces(racesData);
            setTracks(tracksData);

            if (location.state && location.state.season) {
                setSelectedSeason(location.state.season);
            } else if (racesData.length > 0) {
                const allYears = racesData.map(r => new Date(r.date).getFullYear());
                const newestYear = Math.max(...allYears);
                setSelectedSeason(newestYear.toString());
            } else {
                setSelectedSeason('All');
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleChange = (e) => setNewRace({ ...newRace, [e.target.name]: e.target.value });

    const handleAddRace = (e) => {
        e.preventDefault();
        const payload = { ...newRace, round: parseInt(newRace.round) };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${auth.token}` },
            body: JSON.stringify(payload)
        }).then(async res => {
            if (res.ok) {
                fetchData();
                setNewRace({ name: '', date: '', trackId: '', round: '', raceImageUrl: '' });
                alert("Race added!");
            } else {
                const err = await res.json();
                alert(`Error: ${err.message}`);
            }
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this race?')) {
            fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${auth.token}` }
            })
                .then(res => {
                    if (res.ok) {
                        setRaces(races.filter(r => r.id !== id));
                        if ((filteredRaces.length - 1) % itemsPerPage === 0 && currentPage > 1) {
                            setCurrentPage(prev => prev - 1);
                        }
                    }
                });
        }
    };

    const availableSeasons = [...new Set(races.map(r => new Date(r.date).getFullYear()))].sort((a, b) => b - a);

    const filteredRaces = selectedSeason === 'All'
        ? races
        : races.filter(r => new Date(r.date).getFullYear().toString() === selectedSeason);

    const handleSeasonChange = (e) => {
        setSelectedSeason(e.target.value);
        setCurrentPage(1);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRaces = filteredRaces.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRaces.length / itemsPerPage);

    const changePage = (direction) => {
        if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    if (loading) return <div className="f1-container"><p className="loading-msg">Loading Calendar...</p></div>;

    return (
        <div className="f1-container">
            <h2>Race Calendar</h2>

            {auth.isLoggedIn && auth.role === 'admin' && (
                <div className="race-form-wrapper">
                    <form className="form-grid-3-col" onSubmit={handleAddRace}>
                        <input name="name" placeholder="Grand Prix Name" value={newRace.name} onChange={handleChange} className="race-input" required />
                        <input name="date" type="date" value={newRace.date} onChange={handleChange} className="race-input" required />
                        <input name="round" type="number" placeholder="Round" min="0" value={newRace.round} onChange={handleChange} className="race-input" required />

                        <select name="trackId" value={newRace.trackId} onChange={handleChange} className="race-select" required>
                            <option value="" disabled>Select Track...</option>
                            {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>

                        <input name="raceImageUrl" placeholder="Image URL (https://...)" value={newRace.raceImageUrl} onChange={handleChange} className="race-input" />

                        <button type="submit" className="btn-add-result">ADD RACE</button>
                    </form>
                </div>
            )}

            <div className="filter-container">
                <label className="filter-label">Filter by Season:</label>
                <select className="filter-select" value={selectedSeason} onChange={handleSeasonChange}>
                    <option value="All">All Time</option>
                    {availableSeasons.map(year => <option key={year} value={year}>Season {year}</option>)}
                </select>
            </div>

            <div className="cards-container">
                {currentRaces.map(race => (
                    <div key={race.id} className="f1-card">
                        <div
                            className="team-bg-image"
                            style={{
                                backgroundImage: `url(${race.raceImageUrl ? race.raceImageUrl : "https://placehold.co/600x400/1a1a1a/c8102e?text=No+Image"})`
                            }}
                        ></div>

                        <div className="card-content">
                            <h3>{race.name}</h3>
                            <p className="race-round-info">Round {race.round}</p>
                            <p>{new Date(race.date).toLocaleDateString()}</p>
                            <p className="card-country">{race.trackName}</p>

                            <div className="card-actions">
                                <Link to={`/race/${race.id}`}>
                                    <button className="delete-btn details-btn">RESULTS</button>
                                </Link>

                                {auth.isLoggedIn && auth.role === 'admin' && (
                                    <button className="delete-btn" onClick={() => handleDelete(race.id)}>
                                        DELETE
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredRaces.length === 0 && <p className="empty-list-msg">No races found.</p>}

            {filteredRaces.length > itemsPerPage && (
                <div className="pagination-container">
                    <button className="pagination-btn" onClick={() => changePage('prev')} disabled={currentPage === 1}>&lt; PREV</button>
                    <span className="page-info">Page {currentPage} of {totalPages}</span>
                    <button className="pagination-btn" onClick={() => changePage('next')} disabled={currentPage === totalPages}>NEXT &gt;</button>
                </div>
            )}
        </div>
    );
};

export default RacesList;