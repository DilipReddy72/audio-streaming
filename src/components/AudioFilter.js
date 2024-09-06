import React, { useState, useEffect, useRef } from 'react';

const AudioFilter = () => {
  const [filterOn, setFilterOn] = useState(false);
  const [frequency, setFrequency] = useState(200); // Default frequency at 200 Hz
  const audioContext = useRef(null);
  const gainNode = useRef(null);
  const biquadFilter = useRef(null);
  const audioSource = useRef(null);

  // Initialize AudioContext only once after user gesture
  const initializeAudioContext = () => {
    if (audioContext.current === null) {
      audioContext.current = new AudioContext();
    }
  };

  // Function to apply the audio filter
  const applyFilter = (stream) => {
    initializeAudioContext();
    audioSource.current = audioContext.current.createMediaStreamSource(stream);
    gainNode.current = audioContext.current.createGain();
    biquadFilter.current = audioContext.current.createBiquadFilter();

    biquadFilter.current.type = 'lowpass'; // Lowpass filter
    biquadFilter.current.frequency.value = frequency; // Set frequency
    gainNode.current.gain.value = 0.75; // Set gain

    // Connect the audio nodes
    audioSource.current.connect(biquadFilter.current);
    biquadFilter.current.connect(gainNode.current);
    gainNode.current.connect(audioContext.current.destination);
    console.log(`Filter applied at frequency: ${frequency} Hz`);
  };

  // Function to toggle filter on and off
  const toggleFilter = () => {
    setFilterOn(!filterOn);
    if (filterOn) {
      // Disable filter
      console.log('Disabling filter');
      audioSource.current.disconnect();
      audioSource.current.connect(audioContext.current.destination);
    } else {
      // Enable filter
      console.log('Enabling filter');
      navigator.mediaDevices.getUserMedia({ audio: true }).then(applyFilter);
    }
  };

  // Handle slider change
  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value); // Update frequency value
    if (biquadFilter.current) {
      biquadFilter.current.frequency.value = event.target.value; // Update the filter frequency in real-time
    }
  };

  return (
    <div>
      <h2>Audio Filter</h2>
      {/* Button to toggle filter on and off */}
      <button onClick={toggleFilter}>
        {filterOn ? 'Disable Filter' : 'Enable Filter'}
      </button>

      {/* Slider to control the filter frequency */}
      <div>
        <label htmlFor="frequency">Frequency: {frequency} Hz</label>
        <input
          id="frequency"
          type="range"
          min="0"
          max="200"
          step="1"
          value={frequency}
          onChange={handleFrequencyChange}
          disabled={!filterOn} // Disable the slider if filter is off
        />
      </div>
    </div>
  );
};

export default AudioFilter;
