import React, { useState } from 'react';
import axios from 'axios';

function ApiCallComponent() {
  const [clientMessage, setClientMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async () => {
    if (clientMessage.trim() !== '') {
      try {
        const serverEndpoint = 'https://deva.ark4.xyz/api'; // Updated endpoint URL

        // Send the message as an object with a 'user_input' key
        const response = await axios.post(
          serverEndpoint,
          { user_input: clientMessage }, // Send the message as 'user_input'
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const botResponseText = response.data.response; // Assuming your server responds with 'response'

        // Add the user and bot messages to the list of messages
        setMessages([
          ...messages,
          { text: clientMessage, sender: 'user' },
          { text: botResponseText, sender: 'bot' },
        ]);

        // Clear the input field
        setClientMessage('');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <div className="message-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={clientMessage}
          onChange={(e) => setClientMessage(e.target.value)}
        />
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
}

export default ApiCallComponent;
