import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import f1Logo from '../assets/f1.png';

const Navigation = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout();
        navigate('/login');
    };

    return (
        <header>
            <div className="f1-container nav-header">
                <div className="logo">
                    <Link to="/" className="logo-link">
                        <img
                            src={f1Logo}
                            alt="F1 Logo"
                            className="logo-img"
                        />
                        <span className="logo-text">Grand Prix Manager</span>
                    </Link>
                </div>
                <nav>
                    <Link to="/" className="nav-link">
                        {auth.role === 'team_principal' ? 'My Drivers' : 'Grid'}
                    </Link>

                    {auth.isLoggedIn && auth.role === 'team_principal' && auth.teamId ? (
                        <Link to={`/team/${auth.teamId}`} className="nav-link">My Team</Link>
                    ) : (
                        <Link to="/teams" className="nav-link">Teams</Link>
                    )}

                    <Link to="/races" className="nav-link">Races</Link>

                    {!auth.isLoggedIn ? (
                        <Link to="/login" className="nav-link">Login</Link>
                    ) : (
                        <>
                            {auth.role === 'admin' && (
                                <Link to="/admin" className="nav-link">Dashboard</Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="nav-link"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navigation;