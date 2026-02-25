import React, { useContext } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Navigation from './components/Navigation';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import DriversList from './components/DriversList';
import DriverDetails from './components/DriverDetails';
import TeamsList from './components/TeamsList';
import TeamDetails from './components/TeamDetails';
import RacesList from './components/RacesList';
import RaceDetails from './components/RaceDetails';
import NotFound from './components/NotFound';

const AdminRoute = ({ children }) => {
    const auth = useContext(AuthContext);
    if (!auth.isLoggedIn || auth.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    return children;
};

const RootLayout = () => {
    return (
        <AuthProvider>
            <div className="app-wrapper">
                <Navigation />

                <main className="main-content">
                    <Outlet />
                </main>

            </div>
        </AuthProvider>
    );
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            { path: "login", element: <Login /> },

            {
                path: "admin",
                element: (
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                )
            },

            { index: true, element: <DriversList /> },
            { path: "driver/:id", element: <DriverDetails /> },
            { path: "teams", element: <TeamsList /> },
            { path: "team/:id", element: <TeamDetails /> },
            { path: "races", element: <RacesList /> },
            { path: "race/:id", element: <RaceDetails /> }
        ]
    },
    { path: "*", element: <NotFound /> }
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;