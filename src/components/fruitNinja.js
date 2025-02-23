import React, { useState, useEffect, useRef } from 'react';
// Add to imports
import BackButton from './BackButton';



const FRUITS = [
  { 
    type: 'apple', 
    color: '#ff0000', 
    points: 1,
    size: 25,
    emoji: '🍎'
  },
  { 
    type: 'orange', 
    color: '#ffa500', 
    points: 2,
    size: 25,
    emoji: '🍊'
  },
  { 
    type: 'banana', 
    color: '#ffff00', 
    points: 3,
    size: 30,
    emoji: '🍌'
  },
  { 
    type: 'watermelon', 
    color: '#ff6b6b', 
    points: 5,
    size: 35,
    emoji: '🍉'
  },
  { 
    type: 'kiwi', 
    color: '#90EE90', 
    points: 4,
    size: 20,
    emoji: '🥝'
  },
  { 
    type: 'coconut', 
    color: '#8B4513', 
    points: 6,
    size: 30,
    emoji: '🥥'
  },
  { 
    type: 'bomb', 
    color: '#000000', 
    points: -10,
    size: 25,
    emoji: '💣'
  }
];

const FruitNinja = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('fruitNinjaHighScore')) || 0
  );

  const [fruits, setFruits] = useState([]);
  const [slicedFruits, setSlicedFruits] = useState([]);
  const [mouseTrail, setMouseTrail] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastSpawnTime = 0;
    const spawnInterval = 10000; // 2.5 seconds between spawns
    const maxFruitsOnScreen = 4;

    const spawnFruit = (timestamp) => {
      if (timestamp - lastSpawnTime > spawnInterval && fruits.length < maxFruitsOnScreen) {
        const fruit = {
          ...FRUITS[Math.floor(Math.random() * FRUITS.length)],
          x: Math.random() * (canvas.width - 80) + 10,
          y: canvas.height + 30,
          velocityY: -10 - Math.random() * 0.1, // Reduced random variation
          velocityX: (Math.random() - 0.5) * 0.1, // Reduced horizontal movement even more
          rotation: Math.random() * Math.PI * 2,
          scale: 1,
        };
        setFruits(prev => [...prev, fruit]);
        lastSpawnTime = timestamp;
      }
    };

    const updateFruits = () => {
      setFruits(prev => prev
        .map(fruit => ({
          ...fruit,
          x: fruit.x + fruit.velocityX,
          y: fruit.y + fruit.velocityY,
          velocityY: fruit.velocityY + 0.1, // Very gentle gravity
          rotation: fruit.rotation + 0.005,
        }))
        .filter(fruit => fruit.y < canvas.height + 50)
      );
    };

    const updateSlicedFruits = () => {
      setSlicedFruits(prev => prev
        .map(fruit => ({
          ...fruit,
          x: fruit.x + fruit.velocityX,
          y: fruit.y + fruit.velocityY,
          velocityY: fruit.velocityY + 0.1,
          rotation: fruit.rotation + 0.01,
          scale: fruit.scale * 0.98, // Gradually shrink sliced pieces
        }))
        .filter(fruit => fruit.y < canvas.height + 50 && fruit.scale > 0.1) // Remove small or fallen pieces
      );
    };

    const drawFruit = (ctx, fruit) => {
      ctx.save();
      ctx.translate(fruit.x, fruit.y);
      ctx.rotate(fruit.rotation);
      ctx.scale(fruit.scale, fruit.scale);
      
      // Draw the emoji
      ctx.font = `${fruit.size * 2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(fruit.emoji, 0, 0);
      
      ctx.restore();
    };

    const drawSlicedFruit = (ctx, slice) => {
      ctx.save();
      ctx.translate(slice.x, slice.y);
      ctx.rotate(slice.rotation);
      ctx.scale(slice.scale, slice.scale);
      
      // Draw the sliced emoji (same emoji but smaller)
      ctx.font = `${slice.size * 1.5}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(slice.emoji, 0, 0);
      
      ctx.restore();
    };

    const drawMouseTrail = (ctx) => {
      if (mouseTrail.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(mouseTrail[0].x, mouseTrail[0].y);
      
      // Create smooth curve through points
      for (let i = 1; i < mouseTrail.length - 2; i++) {
        const xc = (mouseTrail[i].x + mouseTrail[i + 1].x) / 2;
        const yc = (mouseTrail[i].y + mouseTrail[i + 1].y) / 2;
        ctx.quadraticCurveTo(mouseTrail[i].x, mouseTrail[i].y, xc, yc);
      }
      
      // Gradient for trail
      const gradient = ctx.createLinearGradient(
        mouseTrail[0].x, mouseTrail[0].y,
        mouseTrail[mouseTrail.length - 1].x, mouseTrail[mouseTrail.length - 1].y
      );
      gradient.addColorStop(0, 'rgba(135, 206, 235, 0)');
      gradient.addColorStop(0.5, 'rgba(135, 206, 235, 0.8)');
      gradient.addColorStop(1, 'rgba(135, 206, 235, 0)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    const animate = (timestamp) => {
      if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        spawnFruit(timestamp);
        updateFruits();
        updateSlicedFruits(); // Added separate update for sliced fruits
        
        fruits.forEach(fruit => drawFruit(ctx, fruit));
        slicedFruits.forEach(slice => drawSlicedFruit(ctx, slice));
        drawMouseTrail(ctx);
        
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [fruits, slicedFruits, mouseTrail, gameOver]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMouseTrail(prev => [...prev.slice(-10), { x, y }]); // Reduced trail length from 15 to 10

    // Check for collisions with fruits
    setFruits(prev => {
      const newFruits = [...prev];
      const sliced = [];
      
      for (let i = newFruits.length - 1; i >= 0; i--) {
        const fruit = newFruits[i];
        const dx = fruit.x - x;
        const dy = fruit.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < fruit.size * 1.5) {
          sliced.push(fruit);
          newFruits.splice(i, 1);

          if (fruit.type === 'bomb') {
            setGameOver(true);
          } else {
            setScore(prev => {
              const newScore = prev + fruit.points;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('fruitNinjaHighScore', newScore.toString());
              }
              return newScore;
            });
          }
        }
      }

      // Create sliced pieces with very reduced velocity
      setSlicedFruits(prev => [...prev, 
        ...sliced.map(fruit => ([
          {
            ...fruit,
            velocityY: fruit.velocityY - 1, // Reduced from -2
            velocityX: fruit.velocityX - 1, // Reduced from -2
            scale: 0.7,
          },
          {
            ...fruit,
            velocityY: fruit.velocityY - 1, // Reduced from -2
            velocityX: fruit.velocityX + 1, // Reduced from +2
            scale: 0.7,
          }
        ])).flat()
      ]);

      return newFruits;
    });
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    setFruits([]);
    setSlicedFruits([]);
    setMouseTrail([]);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
        // Add inside the main div of each game component
        <BackButton />
      <h2>Fruit Ninja</h2>
      <div style={{ marginBottom: '10px' }}>
        <span style={{ marginRight: '20px' }}>Score: {score}</span>
        <span>High Score: {highScore}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ 
          border: '2px solid black',
          backgroundColor: '#f0f0f0',
          cursor: 'none'
        }}
        onMouseMove={handleMouseMove}
      />
      {gameOver && (
        <div style={{ marginTop: '20px' }}>
          <p>Game Over!</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default FruitNinja; 