import './App.css';
import React from 'react';
import AudioStream from './components/AudioStream';
import AudioFilter from './components/AudioFilter';
import AudioVisualizer from './components/AudioVisualizer';

const App = () => {
  return (
    <div>
      <h1>React Audio Streaming App</h1>
      <AudioStream />
      <AudioFilter />
      <AudioVisualizer />
    </div>
  );
};

export default App;
