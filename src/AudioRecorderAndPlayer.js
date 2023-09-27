import React, { useState, useRef } from 'react';

const AudioRecorderAndPlayer = ({ onRecordingComplete }) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioRecorderRef = useRef(null);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioRecorderRef.current = new MediaRecorder(stream);
        const chunks = [];

        audioRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        audioRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          setAudioBlob(audioBlob);

          // Notify the parent component that recording is complete
          onRecordingComplete(audioBlob);
        };

        audioRecorderRef.current.start();
        setRecording(true);
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  };

  const stopRecording = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audioURL = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  return (
    <div>
      <h2>Audio Recorder and Player</h2>
      {recording ? (
        <div>
          <button onClick={stopRecording}>Stop Recording</button>
          <p>Recording...</p>
        </div>
      ) : (
        <button onClick={startRecording}>Start Recording</button>
      )}

      {audioBlob && (
        <div>
          <button onClick={playAudio}>Play Audio</button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorderAndPlayer;
