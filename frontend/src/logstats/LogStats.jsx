import 'react'
import { useState } from "react";
import { useApi } from '../utils/api';


export function LogStats() {
    const [formData, setFormData] = useState({
        game_date: '',
        points: 0,
        rebounds: 0,
        assists: 0,
    });

    const {makeRequest} = useApi()

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
        ...prev,
        [name]: name === 'points' || name === 'rebounds' || name === 'assists' ? Number(value) : value
        }));
    };

    const createGame = async (e) => {
        e.preventDefault()

        try {
            console.log(formData);

            const data = await makeRequest('game', {
                method: 'POST',
                body: JSON.stringify(formData)
                }
            )
            alert("Game logged!");
            console.log(data);
            setFormData({ points: 0, rebounds: 0, assists: 0, game_date: Date.now() });
        } catch (err) {
            alert("Error: " + err.message);
            console.error(err);
        }
    }
    

    return (
        <div className='log-stats'>
            <h2>Log Game</h2>
            <form onSubmit={createGame}>
                <div className='stats-form'>
                    {['game_date','points', 'rebounds', 'assists'].map((field) => (
                        <label key={field} className="stats-label">
                            {field.charAt(0).toUpperCase() + field.slice(1)}:
                            {field === 'game_date' ? <input
                                type='date'
                                name={field}
                                value={formData.game_date}
                                onChange={handleChange}
                                min="0"
                            />:
                            <input
                                type='number'
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                min="0"
                            />}
                        </label>
                    ))}
                </div>
                <button type='submit' disabled={false} className='log-game-button'>Log Game</button>
            </form>
        </div>
    )
}