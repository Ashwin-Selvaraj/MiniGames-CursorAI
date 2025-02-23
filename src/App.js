import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import SnakeGame from './components/snakeGame';
import FruitNinja from './components/fruitNinja';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App" style={{ 
        backgroundColor: '#1a1a1a',
        minHeight: '100vh',
        position: 'relative'
      }}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/snake" element={<SnakeGame />} />
          <Route path="/fruit-ninja" element={<FruitNinja />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
