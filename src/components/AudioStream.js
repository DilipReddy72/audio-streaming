import React, { useEffect, useRef } from 'react';

const AudioStream = () => {
  const localAudioRef = useRef();
  const remoteAudioRef = useRef();
  const peerConnection = useRef(null);

  useEffect(() => {
    const setupStream = async () => {
      try {
        // Request access to the user's microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Assign the stream to the local audio element for playback
        localAudioRef.current.srcObject = stream;

        // Initialize the RTCPeerConnection only after receiving the stream
        peerConnection.current = new RTCPeerConnection();

        // Add tracks from the local stream to the peer connection
        stream.getTracks().forEach((track) => {
          peerConnection.current.addTrack(track, stream);
        });

        // When receiving a remote track, assign it to the remote audio element
        peerConnection.current.ontrack = (event) => {
          remoteAudioRef.current.srcObject = event.streams[0];
        };

        // Log ICE connection state changes for debugging
        peerConnection.current.oniceconnectionstatechange = () => {
          const state = peerConnection.current.iceConnectionState;
          if (state === 'disconnected' || state === 'closed') {
            console.log('ICE connection closed or disconnected.');
            peerConnection.current.close();
          }
        };

        console.log('Stream and peer connection setup complete.');
      } catch (error) {
        console.error('Error accessing audio stream:', error);
      }
    };

    setupStream();

    // Clean up the peer connection when the component unmounts
    return () => {
      if (peerConnection.current && peerConnection.current.signalingState !== 'closed') {
        peerConnection.current.close();
      }
    };
  }, []);

  return (
    <div>
      <h2>Audio Streaming</h2>
      {/* Local audio element for monitoring microphone input */}
      <audio ref={localAudioRef} autoPlay muted />
      {/* Remote audio element for listening to the remote peer */}
      <audio ref={remoteAudioRef} autoPlay />
    </div>
  );
};

export default AudioStream;
