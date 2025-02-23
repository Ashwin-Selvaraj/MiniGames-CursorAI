import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: '#1a1a1a',
        color: '#00ffff',
        border: '2px solid #00ffff',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '0.8rem',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#00ffff';
        e.target.style.color = '#1a1a1a';
        e.target.style.boxShadow = '0 0 10px rgba(0,255,255,0.5)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#1a1a1a';
        e.target.style.color = '#00ffff';
        e.target.style.boxShadow = 'none';
      }}
    >
      ← Back
    </button>
  );
};

export default BackButton; 