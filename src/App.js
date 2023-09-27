import React, { useState } from 'react';
import ApiCallComponent from './ApiCallComponent';
import TextToSpeech from './TextToSpeech';
import SpeachToText from './SpeachToText';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentpagenumber, setCurrentPageNumber] = useState(1);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPageNumber(pageNumber);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    // You can send the form data to your server or perform any other action
    console.log('Form submitted');
  };

  if (currentpagenumber === 1) {
    return (
      <div style={{
        position: 'relative',
        minHeight: '100vh',
      }}>
        <center>
          <div style={{
            backgroundColor: isDarkMode ? '#704214' : 'white',
            width: '100vw',
            paddingBottom: '160px',
          }}>
            <img
              src="https://amplify-amplifya785c969872c4-staging-111600-deployment.s3.amazonaws.com/eva.png"
              style={{ width: '100vw', maxWidth: '500px' }}
              alt="Eva Logo" // Add alt text for accessibility
            />
            
              
            <div className="App">
              <TextToSpeech />
            </div>
            <div className="App">
              <SpeachToText />
            </div>
            <div style={{
              backgroundColor: !isDarkMode ? '#fff' : '#704214',
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              top: 'auto',
              marginBottom: '60px',
            }}>
              <ApiCallComponent />
            </div>
            <br />
          </div>
        </center>
      </div>
    );
  }

  // Handle other page numbers or return null for unsupported page numbers
  return null;
}
