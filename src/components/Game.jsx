import { useState, useEffect, useRef } from 'react'
import Bird from './Bird'
import Pipe from './Pipe'
import Background from './Background'
import GameUI from './GameUI'
import './Game.css'

const BIRD_SIZE = 50
const PIPE_WIDTH = 80
const PIPE_GAP = 180
const GRAVITY = 0.6
const JUMP_STRENGTH = -10
const PIPE_SPEED = 3
const PIPE_SPAWN_DISTANCE = 300

const Game = () => {
    const containerRef = useRef(null)
    const [gameWidth, setGameWidth] = useState(800)
    const [gameHeight, setGameHeight] = useState(600)
    const [birdPosition, setBirdPosition] = useState(300)
    const [birdVelocity, setBirdVelocity] = useState(0)
    const [birdRotation, setBirdRotation] = useState(0)
    const [pipes, setPipes] = useState([])
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [gameStarted, setGameStarted] = useState(false)
    const [gameOver, setGameOver] = useState(false)

    const gameLoopRef = useRef(null)
    const lastPipeXRef = useRef(800)
    const scoredPipesRef = useRef(new Set())

    // Update game dimensions on resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setGameWidth(containerRef.current.offsetWidth)
                setGameHeight(containerRef.current.offsetHeight)
            }
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    // Load high score from localStorage
    useEffect(() => {
        const savedHighScore = localStorage.getItem('flappyBirdHighScore')
        if (savedHighScore) {
            setHighScore(parseInt(savedHighScore))
        }
    }, [])

    // Handle jump
    const jump = () => {
        if (!gameStarted || gameOver) return
        setBirdVelocity(JUMP_STRENGTH)
    }

    // Handle keyboard input
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.code === 'Space' && gameStarted && !gameOver) {
                e.preventDefault()
                jump()
            }
            if (e.code === 'Enter' && (!gameStarted || gameOver)) {
                e.preventDefault()
                startGame()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [gameStarted, gameOver])

    // Handle mouse click
    const handleClick = () => {
        if (gameStarted && !gameOver) {
            jump()
        }
    }

    // Start game
    const startGame = () => {
        setBirdPosition(gameHeight / 2)
        setBirdVelocity(0)
        setBirdRotation(0)
        setPipes([{
            x: gameWidth,
            height: Math.random() * (gameHeight * 0.75 - PIPE_GAP - 200) + 100,
            id: Date.now()
        }])
        setScore(0)
        setGameStarted(true)
        setGameOver(false)
        lastPipeXRef.current = gameWidth
        scoredPipesRef.current = new Set()
    }

    // Collision detection
    const checkCollision = (birdY, pipes) => {
        const birdTop = birdY
        const birdBottom = birdY + BIRD_SIZE
        const birdLeft = 100
        const birdRight = 100 + BIRD_SIZE

        // Check ground and ceiling collision
        if (birdBottom >= gameHeight * 0.75 || birdTop <= 0) {
            return true
        }

        // Check pipe collision
        for (let pipe of pipes) {
            const pipeLeft = pipe.x
            const pipeRight = pipe.x + PIPE_WIDTH

            if (birdRight > pipeLeft && birdLeft < pipeRight) {
                if (birdTop < pipe.height || birdBottom > pipe.height + PIPE_GAP) {
                    return true
                }
            }
        }

        return false
    }

    // Game loop
    useEffect(() => {
        if (!gameStarted || gameOver) return

        gameLoopRef.current = setInterval(() => {
            // Update bird physics
            setBirdVelocity((v) => v + GRAVITY)
            setBirdPosition((pos) => {
                const newPos = pos + birdVelocity
                return newPos
            })
            setBirdRotation((rot) => {
                const targetRot = Math.min(Math.max(birdVelocity * 3, -30), 90)
                return targetRot
            })

            // Update pipes
            setPipes((currentPipes) => {
                let newPipes = currentPipes.map((pipe) => ({
                    ...pipe,
                    x: pipe.x - PIPE_SPEED,
                }))

                // Remove off-screen pipes
                newPipes = newPipes.filter((pipe) => pipe.x > -PIPE_WIDTH)

                // Add new pipes
                const lastPipe = newPipes[newPipes.length - 1]
                const lastX = lastPipe ? lastPipe.x : lastPipeXRef.current

                if (lastX < gameWidth - PIPE_SPAWN_DISTANCE) {
                    const minHeight = 100
                    const maxHeight = gameHeight * 0.75 - PIPE_GAP - 100
                    const newHeight = Math.random() * (maxHeight - minHeight) + minHeight

                    newPipes.push({
                        x: gameWidth,
                        height: newHeight,
                        id: Date.now(),
                    })
                    lastPipeXRef.current = gameWidth
                } else {
                    lastPipeXRef.current = lastX
                }

                // Update score
                newPipes.forEach((pipe) => {
                    if (pipe.x + PIPE_WIDTH < 100 && !scoredPipesRef.current.has(pipe.id)) {
                        scoredPipesRef.current.add(pipe.id)
                        setScore((s) => s + 1)
                    }
                })

                return newPipes
            })

            // Check collision
            setBirdPosition((pos) => {
                setPipes((currentPipes) => {
                    if (checkCollision(pos, currentPipes)) {
                        setGameOver(true)
                        setGameStarted(false)

                        // Update high score
                        setScore((currentScore) => {
                            setHighScore((currentHighScore) => {
                                const newHighScore = Math.max(currentScore, currentHighScore)
                                localStorage.setItem('flappyBirdHighScore', newHighScore.toString())
                                return newHighScore
                            })
                            return currentScore
                        })
                    }
                    return currentPipes
                })
                return pos
            })
        }, 1000 / 60) // 60 FPS

        return () => {
            if (gameLoopRef.current) {
                clearInterval(gameLoopRef.current)
            }
        }
    }, [gameStarted, gameOver, birdVelocity, gameWidth, gameHeight])

    return (
        <div className="game-container" ref={containerRef} onClick={handleClick}>
            <Background />

            {gameStarted && (
                <>
                    <Bird birdPosition={birdPosition} rotation={birdRotation} />
                    {pipes.map((pipe) => (
                        <Pipe
                            key={pipe.id}
                            pipeX={pipe.x}
                            pipeHeight={pipe.height}
                            gap={PIPE_GAP}
                        />
                    ))}
                </>
            )}

            <GameUI
                score={score}
                highScore={highScore}
                gameStarted={gameStarted}
                gameOver={gameOver}
                onStart={startGame}
            />
        </div>
    )
}

export default Game
