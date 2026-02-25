import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);

    const initialFormState = { email: '', password: '', role: 'admin', teamId: '' };
    const [formData, setFormData] = useState(initialFormState);

    const [editingId, setEditingId] = useState(null);

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchUsers = () => {
        fetch('http://127.0.0.1:2000/api/v1/auth/users')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error('Error fetching users:', err));
    };

    useEffect(() => {
        fetch('http://127.0.0.1:2000/api/v1/teams')
            .then(res => res.json())
            .then(data => setTeams(data))
            .catch(err => console.error(err));
        fetchUsers();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleEditClick = (user) => {
        setEditingId(user.id);
        setFormData({
            email: user.email,
            password: '',
            role: user.role,
            teamId: user.team_id || ''
        });
        setError('');
        setSuccessMsg('Editing mode enabled.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setError('');
        setSuccessMsg('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await fetch(`http://127.0.0.1:2000/api/v1/auth/users/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Delete failed');

            setSuccessMsg('User removed successfully.');
            fetchUsers();
            if (editingId === id) cancelEdit();
        } catch (err) {
            setError('Could not delete user.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (formData.role === 'team_principal' && !formData.teamId) {
            setError("Team Principal must have a team assigned.");
            return;
        }

        const payload = {
            email: formData.email,
            password: formData.password,
            role: formData.role,
            teamId: formData.role === 'team_principal' ? parseInt(formData.teamId) : null
        };

        try {
            const url = editingId
                ? `http://127.0.0.1:2000/api/v1/auth/users/${editingId}`
                : 'http://127.0.0.1:2000/api/v1/auth/signup';

            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Operation failed.');

            setSuccessMsg(editingId ? 'User updated successfully.' : 'User created successfully.');
            setFormData(initialFormState);
            setEditingId(null);
            fetchUsers();

        } catch (err) {
            setError(err.message);
        }
    };

    const getTeamName = (id) => {
        if (!id) return '-';
        const team = teams.find(t => t.id === id);
        return team ? team.name : id;
    };

    const isTeamSelectDisabled = formData.role !== 'team_principal';

    return (
        <div className="f1-container">
            <div className="admin-dashboard-panel">
                <div className="admin-header-box">
                    <h2 className="admin-title">COMMAND CENTER</h2>
                    <p className="admin-subtitle">User Management & Access Control</p>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-row">
                        <div className="admin-input-group">
                            <label>EMAIL ADDRESS</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="name@team.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="admin-input-group">
                            <label>
                                PASSWORD
                                {editingId && <span className="input-label-hint">(LEAVE EMPTY TO KEEP CURRENT)</span>}
                            </label>
                            <input
                                name="password"
                                type="password"
                                placeholder={editingId ? "Change password (optional)" : "••••••••"}
                                value={formData.password}
                                onChange={handleChange}
                                required={!editingId}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="admin-input-group">
                            <label>ROLE ASSIGNMENT</label>
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value="admin">Administrator</option>
                                <option value="team_principal">Team Principal</option>
                            </select>
                        </div>

                        <div className={`admin-input-group ${isTeamSelectDisabled ? 'disabled' : ''}`}>
                            <label>TEAM ALLOCATION</label>
                            <select
                                name="teamId"
                                value={formData.teamId}
                                onChange={handleChange}
                                required={!isTeamSelectDisabled}
                            >
                                <option value="" disabled>Select Team...</option>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="status-message-container">
                        {error && <div className="status-msg error">⚠ {error}</div>}
                        {successMsg && <div className="status-msg success">✓ {successMsg}</div>}
                    </div>

                    <div className="form-actions-row">
                        <button type="submit" className="btn-create-user">
                            {editingId ? 'UPDATE USER DATA' : 'AUTHORIZE NEW USER'}
                        </button>

                        {editingId && (
                            <button type="button" onClick={cancelEdit} className="btn-cancel-edit">
                                CANCEL
                            </button>
                        )}
                    </div>
                </form>

                <div className="admin-table-section">
                    <h3 className="admin-subtitle admin-table-title">
                        AUTHORIZED PERSONNEL DATABASE
                    </h3>

                    <div className="table-wrapper">
                        <table className="f1-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>EMAIL</th>
                                <th>ROLE</th>
                                <th>ASSIGNED TEAM</th>
                                <th>ACTIONS</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td className="text-grey">{user.id}</td>
                                        <td className="pos-p1">{user.email}</td>
                                        <td className={`role-cell ${user.role === 'admin' ? 'role-admin' : ''}`}>
                                            {user.role}
                                        </td>
                                        <td>{getTeamName(user.team_id)}</td>
                                        <td>
                                            <div className="table-actions-cell">
                                                <button
                                                    className="btn-sm btn-table-edit"
                                                    onClick={() => handleEditClick(user)}
                                                >
                                                    EDIT
                                                </button>
                                                <button
                                                    className="btn-sm btn-table-delete"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    DELETE
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-table-msg">
                                        No personnel records found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;