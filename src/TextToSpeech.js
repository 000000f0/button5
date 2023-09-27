import React, { useState } from 'react';
import AWS from 'aws-sdk';

const AWS_ACCESS_KEY = 'AKIAR22DSRP6A3INZCOZ';
const AWS_SECRET_KEY = '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';

const TextToSpeech = () => {
  const [inputText, setInputText] = useState('');
  const [message, setMessage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleTextToSpeech = async () => {
    try {
      // Reset the audio URL to clear the previous audio
      setAudioUrl('');

      // Initialize Polly client
      AWS.config.update({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
        region: 'eu-west-1', // AWS Polly region
      });

      const polly = new AWS.Polly();

      // Synthesize speech
      const response = await polly.synthesizeSpeech({
        Text: inputText,
        OutputFormat: 'mp3',
        VoiceId: 'Matthew',
      }).promise();

      // Create a Blob object from the audio stream
      const blob = new Blob([response.AudioStream], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      // Set the audio URL to play it in the <audio> element
      setAudioUrl(url);

      setMessage('Audio synthesis complete.');
    } catch (error) {
      if (error.code === 'NoCredentialsError') {
        setMessage('AWS credentials not found. Make sure to configure your AWS credentials.');
      } else {
        setMessage(`An error occurred: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <h1>Text to Speech Conversion</h1>
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text to convert to speech"
      />
      <button onClick={handleTextToSpeech}>Convert to Speech</button>
      <p>{message}</p>
      {audioUrl && (
        <div>
          <h2>Audio Output</h2>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
