import 'react'
import {useState} from 'react'

export function Game({game}) {
    return (
        <div className='game-display'>
            <p><strong>Date Played</strong>: {game.game_date}</p>
            <p><strong>Points</strong>: {game.points}</p>
            <p><strong>Rebounds</strong>: {game.rebounds}</p>
            <p><strong>Assists</strong>: {game.assists}</p>
        </div>
    )
}