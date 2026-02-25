import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    token: null,
    role: null,
    teamId: null,
    login: () => {},
    logout: () => {}
});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);
    const [teamId, setTeamId] = useState(null);

    const login = useCallback((uid, token, userRole, tid) => {
        setToken(token);
        setUserId(uid);
        setRole(userRole);
        setTeamId(tid);

        localStorage.setItem('userData', JSON.stringify({
            userId: uid, token, role: userRole, teamId: tid
        }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setRole(null);
        setTeamId(null);
        localStorage.removeItem('userData');
    }, []);


    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token) {
            login(storedData.userId, storedData.token, storedData.role, storedData.teamId);
        }
    }, [login]);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!token,
                token,
                userId,
                role,
                teamId,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};