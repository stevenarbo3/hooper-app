import React, { useState } from "react";
import { useApi } from '../utils/api';
import { useNavigate } from 'react-router-dom';

export function LogStats() {
    const [formData, setFormData] = useState({
        game_date: new Date().toISOString().split('T')[0],
        points: '',
        rebounds: '',
        assists: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const { makeRequest } = useApi();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        // Clear any previous errors when user starts typing
        if (error) setError(null);
    };

    const validateForm = () => {
        if (!formData.game_date) {
            setError('Please select a game date');
            return false;
        }
        if (!formData.points || formData.points < 0) {
            setError('Please enter valid points (0 or more)');
            return false;
        }
        if (!formData.rebounds || formData.rebounds < 0) {
            setError('Please enter valid rebounds (0 or more)');
            return false;
        }
        if (!formData.assists || formData.assists < 0) {
            setError('Please enter valid assists (0 or more)');
            return false;
        }
        return true;
    };

    const createGame = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const gameData = {
                ...formData,
                points: Number(formData.points),
                rebounds: Number(formData.rebounds),
                assists: Number(formData.assists),
            };

            await makeRequest('game', {
                method: 'POST',
                body: JSON.stringify(gameData)
            });

            setSuccess(true);
            setFormData({
                game_date: new Date().toISOString().split('T')[0],
                points: '',
                rebounds: '',
                assists: '',
            });

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            setError(err.message || 'Failed to log game. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const statFields = [
        { name: 'points', label: 'Points', icon: '🏀' },
        { name: 'rebounds', label: 'Rebounds', icon: '📊' },
        { name: 'assists', label: 'Assists', icon: '🤝' }
    ];

    return (
        <div className="app-main">
            <div className="log-stats-container">
                <div className="log-stats-header">
                    <h1>Log Your Game</h1>
                    <p>Record your basketball performance and track your progress</p>
                </div>

                {success && (
                    <div className="success-message">
                        <h3>Game Logged Successfully!</h3>
                        <p>Redirecting to dashboard...</p>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <h3>Error</h3>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={createGame} className="log-stats-form">
                    <div className="form-section">
                        <h2>Game Details</h2>
                        <div className="form-group">
                            <label htmlFor="game_date" className="form-label">
                                Game Date
                            </label>
                            <input
                                type="date"
                                id="game_date"
                                name="game_date"
                                value={formData.game_date}
                                onChange={handleChange}
                                className="form-input"
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Your Stats</h2>
                        <div className="stats-grid">
                            {statFields.map((field) => (
                                <div key={field.name} className="stat-input-group">
                                    <label htmlFor={field.name} className="stat-label">
                                        {field.label}
                                    </label>
                                    <input
                                        type="number"
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        min="0"
                                        className="stat-input"
                                        placeholder="0"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="submit-button"
                        >
                            {loading ? 'Logging Game...' : 'Log Game'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}