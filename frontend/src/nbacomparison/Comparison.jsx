import React from 'react'

export function Comparison({ comparison }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="comparison-display">
            <div className="comparison-header">
                <h2>Your NBA Comparison</h2>
                <div className="comparison-meta">
                    <span className="era-badge">{comparison.era}</span>
                    <span className="timestamp">{formatDate(comparison.timestamp)}</span>
                </div>
            </div>

            <div className="comparison-content">
                <div className="player-match">
                    <h3>NBA Player Match</h3>
                    <div className="player-name">{comparison.player_name}</div>
                    <img 
                        src={comparison.player_headshot_url}
                        alt="Player Headshot"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-placeholder.png";
                        }}
                        />
                </div>

                <div className="comparison-explanation">
                    <h3>Analysis</h3>
                    <div className="explanation-text">
                        {comparison.explanation}
                    </div>
                </div>
            </div>

            <div className="comparison-footer">
                <p className="comparison-note">
                    This comparison is based on your average game statistics and the playing style of the selected NBA era.
                </p>
            </div>
        </div>
    )
}