import React, { useState, useEffect, useCallback } from 'react';
import BackButton from './BackButton';


const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 8, y: 8 }];
const INITIAL_FOOD = { x: 15, y: 10 };
const INITIAL_DIRECTION = 'RIGHT';
const INITIAL_SPEED = 150;

// Different food types with their properties
const FOOD_TYPES = {
  NORMAL: { color: '#ff3333', points: 1, speedChange: 0, effect: null },
  SPEED_UP: { color: '#ffff00', points: 2, speedChange: -20, effect: 'speed' },
  SLOW_DOWN: { color: '#00ff00', points: 3, speedChange: 20, effect: 'slow' },
  GHOST: { color: '#aa88ff', points: 5, speedChange: 0, effect: 'ghost' },
};

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [foodType, setFoodType] = useState(FOOD_TYPES.NORMAL);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isPaused, setIsPaused] = useState(false);
  const [ghostMode, setGhostMode] = useState(false);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('snakeHighScore')) || 0
  );
  const [level, setLevel] = useState(1);
  const [obstacles, setObstacles] = useState([]);

  const generateObstacles = useCallback(() => {
    const newObstacles = [];
    const numObstacles = Math.min(3 + Math.floor(level / 2), 8);
    
    for (let i = 0; i < numObstacles; i++) {
      let obstacle;
      do {
        obstacle = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        };
      } while (
        snake.some(s => s.x === obstacle.x && s.y === obstacle.y) ||
        (food.x === obstacle.x && food.y === obstacle.y) ||
        newObstacles.some(o => o.x === obstacle.x && o.y === obstacle.y)
      );
      newObstacles.push(obstacle);
    }
    return newObstacles;
  }, [snake, food, level]);

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
      obstacles.some(obs => obs.x === newFood.x && obs.y === newFood.y)
    );

    // Randomly select food type based on current level
    const foodTypes = Object.values(FOOD_TYPES);
    const randomNum = Math.random();
    let selectedType;

    if (randomNum < 0.6) {
      selectedType = FOOD_TYPES.NORMAL;
    } else if (randomNum < 0.75) {
      selectedType = FOOD_TYPES.SPEED_UP;
    } else if (randomNum < 0.9) {
      selectedType = FOOD_TYPES.SLOW_DOWN;
    } else {
      selectedType = FOOD_TYPES.GHOST;
    }

    setFoodType(selectedType);
    return newFood;
  }, [snake, obstacles]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
      default: break;
    }

    // Wrap around walls if in ghost mode, otherwise check collision
    if (!ghostMode) {
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return;
      }
    } else {
      head.x = (head.x + GRID_SIZE) % GRID_SIZE;
      head.y = (head.y + GRID_SIZE) % GRID_SIZE;
    }

    // Check collision with self
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      return;
    }

    // Check collision with obstacles when not in ghost mode
    if (!ghostMode && obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
      setScore(prevScore => {
        const newScore = prevScore + foodType.points;
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('snakeHighScore', newScore.toString());
        }
        return newScore;
      });

      // Apply food effects
      if (foodType.effect === 'speed' || foodType.effect === 'slow') {
        setSpeed(prev => Math.max(50, Math.min(300, prev + foodType.speedChange)));
      } else if (foodType.effect === 'ghost') {
        setGhostMode(true);
        setTimeout(() => setGhostMode(false), 5000);
      }

      setFood(generateFood());
      
      // Level up every 5 points
      if ((score + foodType.points) % 5 === 0) {
        setLevel(prev => prev + 1);
        setObstacles(generateObstacles());
      }
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, generateFood, score, highScore, 
      ghostMode, obstacles, isPaused, foodType, generateObstacles]);

  const handleKeyPress = useCallback((e) => {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      case ' ':
        setIsPaused(prev => !prev);
        break;
      default:
        break;
    }
  }, [direction]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, speed);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [moveSnake, handleKeyPress, speed]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setFoodType(FOOD_TYPES.NORMAL);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGhostMode(false);
    setLevel(1);
    setObstacles(generateObstacles());
    setIsPaused(false);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
        // Add inside the main div of each game component
        <BackButton />
      <h2>Snake Game - Level {level}</h2>
      <div style={{ marginBottom: '10px' }}>
        <span style={{ marginRight: '20px' }}>Score: {score}</span>
        <span>High Score: {highScore}</span>
      </div>
      <div style={{ 
        display: 'inline-block',
        position: 'relative',
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        border: '2px solid black',
        backgroundColor: '#1a1a1a'
      }}>
        {/* Render snake */}
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: index === 0 ? '#4a9eff' : '#2d7cd6',
              borderRadius: index === 0 ? '8px 8px 0 0' : '0px',
              border: '1px solid rgba(255,255,255,0.2)',
              transform: index === 0 ? `rotate(${
                direction === 'UP' ? '-90deg' :
                direction === 'DOWN' ? '90deg' :
                direction === 'LEFT' ? '180deg' : '0deg'
              })` : 'none',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.3)',
              backgroundImage: `linear-gradient(
                ${index === 0 ? '45deg' : '0deg'},
                ${index === 0 ? '#4a9eff' : '#2d7cd6'} 0%,
                #89c2ff 50%,
                ${index === 0 ? '#4a9eff' : '#2d7cd6'} 100%
              )`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                background: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)',
                borderRadius: 'inherit'
              }
            }}
          >
            {index === 0 && (
              <>
                <div style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  backgroundColor: 'black',
                  borderRadius: '50%',
                  top: '4px',
                  left: '4px',
                  boxShadow: '0 0 2px rgba(255,255,255,0.5)'
                }} />
                <div style={{
                  position: 'absolute',
                  width: '4px',
                  height: '4px',
                  backgroundColor: 'black',
                  borderRadius: '50%',
                  top: '4px',
                  right: '4px',
                  boxShadow: '0 0 2px rgba(255,255,255,0.5)'
                }} />
              </>
            )}
          </div>
        ))}
        {/* Render obstacles */}
        {obstacles.map((obstacle, index) => (
          <div
            key={`obstacle-${index}`}
            style={{
              position: 'absolute',
              left: obstacle.x * CELL_SIZE,
              top: obstacle.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: '#666666',
              border: '1px solid #888888',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.5)'
            }}
          />
        ))}
        {/* Render food with current type */}
        <div
          style={{
            position: 'absolute',
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
            margin: '2px',
            backgroundColor: foodType.color,
            borderRadius: '50%',
            boxShadow: `0 0 8px ${foodType.color}`,
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        {ghostMode && <p style={{ color: '#aa88ff' }}>Ghost Mode Active!</p>}
        {isPaused && <p>Game Paused</p>}
        {gameOver && (
          <div>
            <p>Game Over!</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
