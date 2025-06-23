import React, { useState, useEffect } from 'react'
import { Comparison } from './Comparison'
import { useApi } from '../utils/api'

export function ComparisonGenerator() {
    const [comparison, setComparison] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [quota, setQuota] = useState(null)
    const [era, setEra] = useState("all-time")

    const { makeRequest } = useApi()

    useEffect(() => {
        fetchQuota()
    }, [])

    const fetchQuota = async () => {
        try {
            const data = await makeRequest('quota')
            setQuota(data)
        } catch (err) {
            console.error('Error fetching quota:', err)
        }
    }
    
    const generateComparison = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await makeRequest('generate-comparison', {
                method: 'POST',
                body: JSON.stringify({ era })
            })
            setComparison(data)
            fetchQuota()
        } catch (err) {
            setError(err.message || 'Failed to generate comparison')
        } finally {
            setIsLoading(false)
        }
    }

    const getNextResetTime = () => {
        if (!quota?.last_reset_date) return null
        const resetDate = new Date(quota.last_reset_date)
        resetDate.setHours(resetDate.getHours() + 24)
        return resetDate
    }

    const eras = [
        { value: "all-time", label: "All-Time Greats" },
        { value: "2020s", label: "2020s - Modern Era" },
        { value: "2010s", label: "2010s - LeBron & Warriors Era" },
        { value: "2000s", label: "2000s - Kobe & Duncan Era" },
        { value: "1990s", label: "1990s - Michael Jordan Era" },
        { value: "1980s", label: "1980s - Magic vs Bird Era" }
    ]

    const isQuotaExhausted = quota?.quota_remaining === 0

    return (
        <div className="app-main">
            <div className="comparison-container">
                <div className="comparison-header">
                    <h1>NBA Player Comparison</h1>
                    <p>Compare your basketball stats with legendary NBA players from different eras</p>
                </div>

                <div className="quota-section">
                    <h2>Your Daily Quota</h2>
                    <div className="quota-card">
                        <div className="quota-info">
                            <span className="quota-remaining">{quota?.quota_remaining || 0}</span>
                            <span className="quota-label">comparisons remaining today</span>
                        </div>
                        {isQuotaExhausted && (
                            <p className="quota-reset">
                                Next reset: {getNextResetTime()?.toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>

                <div className="comparison-form">
                    <h2>Generate Your Comparison</h2>
                    <div className="form-section">
                        <label htmlFor="era-select" className="form-label">
                            Select NBA Era
                        </label>
                        <select
                            id="era-select"
                            value={era}
                            onChange={(e) => setEra(e.target.value)}
                            disabled={isLoading || isQuotaExhausted}
                            className="era-select"
                        >
                            {eras.map((eraOption) => (
                                <option key={eraOption.value} value={eraOption.value}>
                                    {eraOption.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button
                            onClick={generateComparison}
                            disabled={isLoading || isQuotaExhausted}
                            className="generate-button"
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    Generating Comparison...
                                </>
                            ) : (
                                'Generate NBA Comparison'
                            )}
                        </button>
                    </div>

                    {isQuotaExhausted && (
                        <div className="quota-exhausted">
                            <p>You've used all your daily comparisons. Come back tomorrow for more!</p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="error-message">
                        <h3>Error</h3>
                        <p>{error}</p>
                    </div>
                )}

                {comparison && (
                    <div className="comparison-result">
                        <Comparison comparison={comparison} />
                    </div>
                )}
            </div>
        </div>
    )
}