import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AWS from 'aws-sdk';

const TalkComponent = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcribedText, setTranscribedText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [message, setMessage] = useState('');
  const [apiResponse, setApiResponse] = useState('');

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    setTranscribedText(result);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    setIsListening(false);
  };

  const handleTextToSpeech = async (textToSpeak) => {
    try {
      setAudioUrl('');
      AWS.config.update({
        accessKeyId: 'AKIAR22DSRP6A3INZCOZ',
        secretAccessKey: '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',
        region: 'eu-west-1',
      });
      

      const polly = new AWS.Polly();
      const response = await polly.synthesizeSpeech({
        Text: textToSpeak,
        OutputFormat: 'mp3',
        VoiceId: 'Matthew',
      }).promise();

      const blob = new Blob([response.AudioStream], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      setAudioUrl(url);
      setMessage('Audio synthesis complete.');
    } catch (error) {
      setMessage(
        error.code === 'NoCredentialsError'
          ? 'AWS credentials not found. Make sure to configure your AWS credentials.'
          : `An error occurred: ${error.message}`
      );
    }
  };

  const handleSendToApi = async () => {
    try {
      const serverEndpoint = 'https://deva.ark4.xyz/api'; // Updated endpoint URL
  
      const requestData = {
        user_input: transcribedText, // Assuming the API expects 'user_input'
      };
  
      const response = await axios.post(
        serverEndpoint,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      const apiResponseText = response.data.response;
      setApiResponse(apiResponseText);
  
      // Automatically start text-to-speech when the API response is received
      if (apiResponseText) {
        await handleTextToSpeech(apiResponseText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  useEffect(() => {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      setIsSupported(false);
    }

    return () => {
      recognition.stop();
    };
  }, []);

  return (
    <div>
      <h2>Speech to Text</h2>
      {isSupported && (
        <>
          <button onClick={toggleListening}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
          {isListening && <p>Listening...</p>}
        </>
      )}
      {!isSupported && <p>Speech recognition is not supported in this browser.</p>}
      <h3>Transcribed Text:</h3>
      <p>{transcribedText}</p>
      {transcribedText && (
        <>
          <button onClick={handleSendToApi}>Send to API</button>
          <h2>API Response Text</h2>
          <p>{apiResponse}</p>
          <h3>Text to Speech Conversion</h3>
          <button onClick={() => handleTextToSpeech(apiResponse)}>Convert to Speech</button>
          <p>{message}</p>
          {audioUrl && (
            <div>
              <h4>Audio Output</h4>
              <audio controls>
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TalkComponent;
