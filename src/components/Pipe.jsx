import React from 'react'
import './Pipe.css'

const Pipe = ({ pipeX, pipeHeight, gap }) => {
    const topPipeHeight = pipeHeight
    const bottomPipeTop = pipeHeight + gap

    return (
        <div
            className="pipe-container"
            style={{
                left: `${pipeX}px`
            }}
        >
            {/* Top Pipe */}
            <div
                className="pipe pipe-top"
                style={{
                    height: `${topPipeHeight}px`
                }}
            >
                <div className="pipe-body">
                    <div className="pipe-segment"></div>
                    <div className="pipe-segment"></div>
                    <div className="pipe-segment"></div>
                </div>
                <div className="pipe-cap"></div>
            </div>

            {/* Bottom Pipe */}
            <div
                className="pipe pipe-bottom"
                style={{
                    top: `${bottomPipeTop}px`
                }}
            >
                <div className="pipe-cap pipe-cap-bottom"></div>
                <div className="pipe-body">
                    <div className="pipe-segment"></div>
                    <div className="pipe-segment"></div>
                    <div className="pipe-segment"></div>
                </div>
            </div>
        </div>
    )
}

export default Pipe
