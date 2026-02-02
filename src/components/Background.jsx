import React from 'react'
import './Background.css'

const Background = () => {
    return (
        <div className="background">
            <div className="sky">
                <div className="cloud cloud-1"></div>
                <div className="cloud cloud-2"></div>
                <div className="cloud cloud-3"></div>
                <div className="sun"></div>
            </div>
            <div className="mountains">
                <div className="mountain mountain-1"></div>
                <div className="mountain mountain-2"></div>
                <div className="mountain mountain-3"></div>
            </div>
            <div className="ground"></div>
            <div className="grass-layer"></div>
        </div>
    )
}

export default Background
