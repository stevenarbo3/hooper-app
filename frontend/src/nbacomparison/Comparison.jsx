import 'react'
import {useState} from 'react'

export function Comparison({comparison}) {
    return (
        <div className='challenge-display'>
            <p><strong>Era</strong>: {comparison.era}</p>
            <p className='challenge-title'>{comparison.title}</p>
        </div>
    )
}