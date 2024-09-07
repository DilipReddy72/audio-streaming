import React, { useEffect, useRef, useState } from 'react';

const AudioStream = () => {
  const localAudioRef = useRef();
  const remoteAudioRef = useRef();
  const peerConnection = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const localStream = useRef(null);

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current = stream;
      localAudioRef.current.srcObject = stream;

      peerConnection.current = new RTCPeerConnection();
      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        remoteAudioRef.current.srcObject = event.streams[0];
      };

      peerConnection.current.oniceconnectionstatechange = () => {
        const state = peerConnection.current.iceConnectionState;
        if (state === 'disconnected' || state === 'closed') {
          console.log('ICE connection closed or disconnected.');
          peerConnection.current.close();
        }
      };

      setIsStreaming(true);
      console.log('Stream and peer connection setup complete.');
    } catch (error) {
      console.error('Error accessing audio stream:', error);
    }
  };

  const stopStreaming = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localAudioRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  return (
    <div>
      <h2>Audio Streaming</h2>
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
      {!isStreaming && <button onClick={startStreaming}>Start Streaming</button>}
      {isStreaming && <button onClick={stopStreaming}>Stop Streaming</button>}
    </div>
  );
};

export default AudioStream;
