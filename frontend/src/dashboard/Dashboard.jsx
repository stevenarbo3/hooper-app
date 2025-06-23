import React, { useState, useEffect } from 'react'
import { useApi } from '../utils/api.js'
import { Link } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

export function Dashboard() {
    const [userStats, setUserStats] = useState(null)
    const [recentGames, setRecentGames] = useState([])
    const [quota, setQuota] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { makeRequest } = useApi()
    const { user } = useAuth()

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true)
                
                // Fetch user's game history
                const gamesData = await makeRequest('my-history')
                setRecentGames(gamesData.games || [])
                
                // Fetch quota information
                const quotaData = await makeRequest('quota')
                setQuota(quotaData)
                
                // Calculate user stats from games
                if (gamesData.games && gamesData.games.length > 0) {
                    const stats = calculateStats(gamesData.games)
                    setUserStats(stats)
                }
                
            } catch (err) {
                console.error('Error fetching dashboard data:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const calculateStats = (games) => {
        if (!games || games.length === 0) return null

        const totals = games.reduce((acc, game) => ({
            points: acc.points + game.points,
            rebounds: acc.rebounds + game.rebounds,
            assists: acc.assists + game.assists,
            games: acc.games + 1
        }), { points: 0, rebounds: 0, assists: 0, games: 0 })

        return {
            totalGames: totals.games,
            avgPoints: Math.round((totals.points / totals.games) * 10) / 10,
            avgRebounds: Math.round((totals.rebounds / totals.games) * 10) / 10,
            avgAssists: Math.round((totals.assists / totals.games) * 10) / 10,
            totalPoints: totals.points,
            totalRebounds: totals.rebounds,
            totalAssists: totals.assists
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="app-main">
                <div className="loading">
                    <h2>Loading your dashboard...</h2>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="app-main">
                <div className="error-message">
                    <h2>Error loading dashboard</h2>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="app-main">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.firstName || 'Player'}!</h1>
                <p>Track your basketball journey and see your progress</p>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <Link to="/logstats" className="action-card">
                    <div className="action-icon">Stats</div>
                    <h3>Log New Game</h3>
                    <p>Record your latest basketball stats</p>
                </Link>
                <Link to="/nbacomparison" className="action-card">
                    <div className="action-icon">Compare</div>
                    <h3>NBA Comparison</h3>
                    <p>Compare your stats with NBA players</p>
                </Link>
                <Link to="/history" className="action-card">
                    <div className="action-icon">History</div>
                    <h3>View History</h3>
                    <p>See all your past games</p>
                </Link>
            </div>

            {/* Stats Overview */}
            {userStats && (
                <div className="stats-overview">
                    <h2>Your Stats Overview</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value">{userStats.totalGames}</div>
                            <div className="stat-label">Total Games</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{userStats.avgPoints}</div>
                            <div className="stat-label">Avg Points</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{userStats.avgRebounds}</div>
                            <div className="stat-label">Avg Rebounds</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">{userStats.avgAssists}</div>
                            <div className="stat-label">Avg Assists</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quota Information */}
            {quota && (
                <div className="quota-section">
                    <h2>NBA Comparison Quota</h2>
                    <div className="quota-card">
                        <div className="quota-info">
                            <span className="quota-remaining">{quota.quota_remaining || 0}</span>
                            <span className="quota-label">comparisons remaining today</span>
                        </div>
                        <p className="quota-note">
                            Your quota resets daily. Use your comparisons wisely!
                        </p>
                    </div>
                </div>
            )}

            {/* Recent Games */}
            <div className="recent-games">
                <h2>Recent Games</h2>
                {recentGames.length > 0 ? (
                    <div className="games-list">
                        {recentGames.slice(0, 5).map((game) => (
                            <div key={game.id} className="game-card">
                                <div className="game-date">{formatDate(game.game_date)}</div>
                                <div className="game-stats">
                                    <span className="stat">{game.points} pts</span>
                                    <span className="stat">{game.rebounds} reb</span>
                                    <span className="stat">{game.assists} ast</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-games">
                        <p>No games logged yet. Start by logging your first game!</p>
                        <Link to="/logstats" className="log-first-game-btn">
                            Log Your First Game
                        </Link>
                    </div>
                )}
            </div>

            {/* Performance Insights */}
            {userStats && userStats.totalGames > 0 && (
                <div className="performance-insights">
                    <h2>Performance Insights</h2>
                    <div className="insights-grid">
                        <div className="insight-card">
                            <h3>Best Performance</h3>
                            <p>Keep up the great work! Your average of {userStats.avgPoints} points per game shows consistent scoring.</p>
                        </div>
                        <div className="insight-card">
                            <h3>Areas to Improve</h3>
                            <p>Consider focusing on {userStats.avgRebounds < 5 ? 'rebounding' : userStats.avgAssists < 3 ? 'playmaking' : 'defense'} to elevate your game.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}