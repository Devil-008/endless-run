import React from 'react'
import './GameUI.css'

const GameUI = ({ score, highScore, gameStarted, gameOver, onStart }) => {
    return (
        <div className="game-ui">
            {!gameStarted && !gameOver && (
                <div className="start-screen">
                    <h1 className="game-title">Flappy Bird</h1>
                    <p className="game-subtitle">Nature Edition</p>
                    <button className="start-button" onClick={onStart}>
                        Start Game
                    </button>
                    <p className="instructions">Press SPACE or Click to Flap</p>
                </div>
            )}

            {gameOver && (
                <div className="game-over-screen">
                    <h2 className="game-over-title">Game Over!</h2>
                    <div className="score-display">
                        <div className="score-item">
                            <span className="score-label">Score:</span>
                            <span className="score-value">{score}</span>
                        </div>
                        <div className="score-item">
                            <span className="score-label">Best:</span>
                            <span className="score-value">{highScore}</span>
                        </div>
                    </div>
                    <button className="restart-button" onClick={onStart}>
                        Play Again
                    </button>
                    <p className="instructions">Press ENTER to Restart</p>
                </div>
            )}

            {gameStarted && !gameOver && (
                <div className="score-board">
                    <div className="current-score">{score}</div>
                    <div className="high-score">Best: {highScore}</div>
                </div>
            )}
        </div>
    )
}

export default GameUI
