import './App.css';
import React from 'react';
import AudioStream from './components/AudioStream';
import AudioFilter from './components/AudioFilter';
import AudioVisualizer from './components/AudioVisualizer';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1> Audio Streaming App</h1>
        <nav className="navbar">
          <ul>
            <li><a href="#stream">Audio Stream</a></li>
            <li><a href="#filter">Audio Filter</a></li>
            <li><a href="#visualizer">Audio Visualizer</a></li>
          </ul>
        </nav>
      </header>
      <main className="App-main">
        <section id="stream" className="section">
          <h2>Audio Streaming</h2>
          <AudioStream />
        </section>
        <section id="filter" className="section">
          <h2>Audio Filter</h2>
          <AudioFilter />
        </section>
        <section id="visualizer" className="section">
          <h2>Audio Visualizer</h2>
          <AudioVisualizer />
        </section>
      </main>
      <footer className="App-footer">
        <p>© 2024 Audio App, All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
