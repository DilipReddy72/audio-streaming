import React, { useRef, useEffect, useState } from 'react';

const AudioVisualizer = () => {
  const canvasRef = useRef();
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const bufferLength = useRef(0);
  const animationId = useRef(null);
  const source = useRef(null);
  const [isVisualizing, setIsVisualizing] = useState(false);

  const initializeAudioContext = () => {
    if (audioContext.current === null) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 2048;
      bufferLength.current = analyser.current.frequencyBinCount;
      dataArray.current = new Uint8Array(bufferLength.current);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    
    if (!analyser.current) return;

    const drawWaveform = () => {
      // Clear the canvas
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Get the current waveform data
      analyser.current.getByteTimeDomainData(dataArray.current);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength.current;
      let x = 0;

      // Draw the waveform
      for (let i = 0; i < bufferLength.current; i++) {
        const v = dataArray.current[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    drawWaveform();
    animationId.current = requestAnimationFrame(draw);
  };

  const startVisualization = () => {
    initializeAudioContext();
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      source.current = audioContext.current.createMediaStreamSource(stream);
      source.current.connect(analyser.current);
      setIsVisualizing(true);
      draw();
    }).catch((error) => {
      console.error('Error accessing audio stream for visualization:', error);
    });
  };

  const stopVisualization = () => {
    if (source.current) {
      source.current.disconnect();
      source.current = null;
    }
    cancelAnimationFrame(animationId.current);
    setIsVisualizing(false);
  };

  return (
    <div>
      <h2>Audio Visualizer</h2>
      <canvas ref={canvasRef} width="500" height="200" />
      {!isVisualizing && (
        <button onClick={startVisualization}>Start Visualization</button>
      )}
      {isVisualizing && (
        <button onClick={stopVisualization}>Stop Visualization</button>
      )}
    </div>
  );
};

export default AudioVisualizer;
