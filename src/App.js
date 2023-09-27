import React, { useState, useEffect } from 'react';
import SpeechToText from './SpeechToText';
import TextToSpeech from './TextToSpeech';
import ApiCallComponent from './ApiCallComponent';
import All from './all';



import './App.css';

function App() {
  const [transcribedText, setTranscribedText] = useState('');
  const [apiResponse, setApiResponse] = useState('');

  const handleTranscription = (text) => {
    setTranscribedText(text);
  };

  const handleApiResponse = (response) => {
    setApiResponse(response);
  };

  return (
    <div className="App">

      
      
      <All />
    </div>
  );
}

export default App;
