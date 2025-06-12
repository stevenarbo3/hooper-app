import 'react'
import { useState, useEffect} from 'react'
import { Comparison } from './Comparison'
export function ComparisonGenerator() {
    const [comparison, setComparison] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [quota, setQuota] = useState(null)
    const [era, setEra] = useState("all-time")

    const fetchQuota = async () => {}
    
    const generateComparison = async () => {}

    const getNextResetTime = async () => {}



    return (
        <div className='challenge-container'>
            <h2>NBA Comparison Generator</h2>

            <div className='quota-display'>
                <p>Comparisons remaining today: {quota?.quota_remaining || 0}</p>
                {quota?.quota_remaining === 0 && (
                    <p>Next reset: {0}</p>
                )}
            </div>

            <div className="difficulty-selector">
            <label htmlFor="difficulty">Select Era</label>
            <select
                id="difficulty"
                value={era}
                onChange={(e) => setEra(e.target.value)}
                disabled={isLoading}
            >
                <option value="all-time">All-Time</option>
                <option value="2020s">2020s</option>
                <option value="2010s">2010s</option>
                <option value="2000s">2000s</option>
                <option value="1990s">1990s</option>
                <option value="1980s">1980s</option>
            </select>
        </div>

            <button
                onClick={generateComparison}
                disabled={isLoading || quota?.quota_remaining === 0}
                className='generate-button'
            >
                {isLoading ? 'Generating...' : 'Generate Comparison'}
            </button>

            {error &&  
                <div className='error-message'>
                    <p>{error}</p>
                </div>
            }

            {comparison && <Comparison comparison={comparison}/> }
        </div>
    )
}