import React from 'react'
import './Bird.css'

const Bird = ({ birdPosition, rotation }) => {
    return (
        <div
            className="bird"
            style={{
                top: `${birdPosition}px`,
                transform: `rotate(${rotation}deg)`
            }}
        >
            <div className="bird-body">
                <div className="bird-head">
                    <div className="bird-eye"></div>
                    <div className="bird-beak"></div>
                </div>
                <div className="bird-wing"></div>
                <div className="bird-tail"></div>
            </div>
        </div>
    )
}

export default Bird
