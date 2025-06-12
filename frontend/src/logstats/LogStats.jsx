import 'react'

export function LogStats() {

    return (
        <div className='log-stats'>
            <h2>Log Game</h2>
            <form className='stats-form'>
                <label className='stats-label'>
                Points:
                <input type='number' name='points' min='0'/>
                </label>
                <label className='stats-label'>
                Rebounds:
                <input type='number' name='rebounds' min='0'/>
                </label>
                <label className='stats-label'>
                Assists:
                <input type='number' name='assists' min='0'/>
                </label>
            </form>
            <button disabled={false} className='log-game-button'>Log Game</button>
        </div>
    )
}