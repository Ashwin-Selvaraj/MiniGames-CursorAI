import React from 'react';
import { useNavigate } from 'react-router-dom';

const games = [
  {
    id: 'snake',
    title: 'Snake Game',
    description: 'Classic snake game with modern twists',
    icon: '🐍',
    energy: 5,
    level: 1,
  },
  {
    id: 'fruit-ninja',
    title: 'Fruit Ninja',
    description: 'Slice fruits with precision',
    icon: '🍎',
    energy: 3,
    level: 1,
  }
];

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      color: '#fff',
      fontFamily: '"Press Start 2P", monospace',
    }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        border: '2px solid #333',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#00ff00',
          textShadow: '0 0 10px rgba(0,255,0,0.5)',
          margin: '0',
          fontSize: '2rem',
        }}>
          ARCADE ZONE
        </h1>
      </div>

      {/* Stats Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px',
        background: '#2a2a2a',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #444',
      }}>
        <div style={{ color: '#ffff00' }}>
          LEVEL 1
          <div style={{
            width: '150px',
            height: '10px',
            backgroundColor: '#333',
            borderRadius: '5px',
            marginTop: '5px',
          }}>
            <div style={{
              width: '30%',
              height: '100%',
              backgroundColor: '#ffff00',
              borderRadius: '5px',
            }}/>
          </div>
        </div>
        <div style={{ color: '#00ffff' }}>
          ENERGY ⚡
          <div style={{
            width: '150px',
            height: '10px',
            backgroundColor: '#333',
            borderRadius: '5px',
            marginTop: '5px',
          }}>
            <div style={{
              width: '80%',
              height: '100%',
              backgroundColor: '#00ffff',
              borderRadius: '5px',
            }}/>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        padding: '10px',
      }}>
        {games.map(game => (
          <div
            key={game.id}
            onClick={() => navigate(`/${game.id}`)}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              cursor: 'pointer',
              border: '2px solid #444',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 0 20px rgba(0,255,255,0.2)',
                border: '2px solid #00ffff',
              }
            }}
          >
            <div style={{
              fontSize: '3rem',
              textAlign: 'center',
              marginBottom: '15px',
            }}>
              {game.icon}
            </div>
            <h3 style={{
              color: '#00ffff',
              textAlign: 'center',
              marginBottom: '10px',
              textShadow: '0 0 5px rgba(0,255,255,0.5)',
            }}>
              {game.title}
            </h3>
            <p style={{
              color: '#888',
              textAlign: 'center',
              fontSize: '0.8rem',
              marginBottom: '15px',
            }}>
              {game.description}
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#666',
              fontSize: '0.8rem',
              borderTop: '1px solid #444',
              paddingTop: '10px',
            }}>
              <span>Level {game.level}</span>
              <span>Energy: {game.energy}⚡</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
        marginTop: '30px',
        borderTop: '2px solid #333',
      }}>
        <button style={buttonStyle}>
          GAMES
        </button>
        <button style={buttonStyle}>
          MARKET
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  backgroundColor: '#1a1a1a',
  color: '#00ff00',
  border: '2px solid #00ff00',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontFamily: '"Press Start 2P", monospace',
  fontSize: '0.8rem',
  transition: 'all 0.3s ease',
  ':hover': {
    backgroundColor: '#00ff00',
    color: '#1a1a1a',
    boxShadow: '0 0 10px rgba(0,255,0,0.5)',
  }
};

export default HomeScreen; 