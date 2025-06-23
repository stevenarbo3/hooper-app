import React, { useState, useEffect } from 'react'
import { Game } from './Game'
import { useApi } from '../utils/api'

export function HistoryPanel() {
    const [history, setHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const { makeRequest } = useApi()

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await makeRequest('my-history')
            setHistory(data.games || [])
        } catch (err) {
            setError(`Failed to load game history: ${err.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getTotalStats = () => {
        if (!history.length) return null
        
        return history.reduce((acc, game) => ({
            totalGames: acc.totalGames + 1,
            totalPoints: acc.totalPoints + game.points,
            totalRebounds: acc.totalRebounds + game.rebounds,
            totalAssists: acc.totalAssists + game.assists
        }), {
            totalGames: 0,
            totalPoints: 0,
            totalRebounds: 0,
            totalAssists: 0
        })
    }

    if (isLoading) {
        return (
            <div className="app-main">
                <div className="loading">
                    <h2>Loading your game history...</h2>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="app-main">
                <div className="error-message">
                    <h3>Error Loading History</h3>
                    <p>{error}</p>
                    <button onClick={fetchHistory} className="retry-button">
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    const totalStats = getTotalStats()

    return (
        <div className="app-main">
            <div className="history-container">
                <div className="history-header">
                    <h1>Game History</h1>
                    <p>Track your basketball journey through all your recorded games</p>
                </div>

                {totalStats && (
                    <div className="history-summary">
                        <h2>Overall Statistics</h2>
                        <div className="summary-stats">
                            <div className="summary-stat">
                                <div className="summary-value">{totalStats.totalGames}</div>
                                <div className="summary-label">Total Games</div>
                            </div>
                            <div className="summary-stat">
                                <div className="summary-value">{totalStats.totalPoints}</div>
                                <div className="summary-label">Total Points</div>
                            </div>
                            <div className="summary-stat">
                                <div className="summary-value">{totalStats.totalRebounds}</div>
                                <div className="summary-label">Total Rebounds</div>
                            </div>
                            <div className="summary-stat">
                                <div className="summary-value">{totalStats.totalAssists}</div>
                                <div className="summary-label">Total Assists</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="history-content">
                    <h2>All Games</h2>
                    {history.length === 0 ? (
                        <div className="no-games">
                            <h3>No Games Yet</h3>
                            <p>Start your basketball journey by logging your first game!</p>
                        </div>
                    ) : (
                        <div className="games-list">
                            {history.map((game) => (
                                <Game
                                    game={game}
                                    key={game.id}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}