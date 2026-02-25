import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="f1-container not-found-container">
            <h1 className="error-code">404</h1>
            <h2>Pit Stop Error</h2>
            <p>This page is not on the track map.</p>
            <Link to="/">
                <button className="add-btn">Return to Paddock</button>
            </Link>
        </div>
    );
};

export default NotFound;