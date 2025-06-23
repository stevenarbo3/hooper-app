import React from 'react'

export function Game({ game, formatDate }) {
    const gameDate = formatDate ? formatDate(game.game_date) : game.game_date

    return (
        <div className="game-card">
            <div className="game-header">
                <div className="game-date">{gameDate}</div>
                <div className="game-id">#{game.id}</div>
            </div>
            
            <div className="game-stats">
                <div className="stat-item">
                    <div className="stat-value">{game.points}</div>
                    <div className="stat-label">Points</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{game.rebounds}</div>
                    <div className="stat-label">Rebounds</div>
                </div>
                <div className="stat-item">
                    <div className="stat-value">{game.assists}</div>
                    <div className="stat-label">Assists</div>
                </div>
            </div>

            <div className="game-performance">
                <div className="performance-indicator">
                    <span className="performance-label">Performance:</span>
                    <span className={`performance-score ${getPerformanceClass(game.points)}`}>
                        {getPerformanceText(game.points)}
                    </span>
                </div>
            </div>
        </div>
    )
}

const getPerformanceClass = (points) => {
    if (points >= 20) return 'excellent'
    if (points >= 15) return 'good'
    if (points >= 10) return 'average'
    return 'developing'
}

const getPerformanceText = (points) => {
    if (points >= 20) return 'Excellent'
    if (points >= 15) return 'Good'
    if (points >= 10) return 'Average'
    return 'Developing'
}