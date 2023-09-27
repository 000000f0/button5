import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatModal = ({ isDarkMode, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatHistoryRef = useRef(null);

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      const userMessage = { user_input: newMessage }; // Use 'user_input' key as expected by the server
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');

      try {
        const serverEndpoint = 'https://deva.ark4.xyz/api'; // Correct endpoint URL
        const response = await axios.post(serverEndpoint, userMessage);
        const botResponseText = response.data.response; // Use 'response' key
        const botResponse = { text: botResponseText, sender: 'bot' };
        setMessages([...messages, botResponse]);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`chat-modal ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="chat-header">
        <h2>Chat History</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="chat-history" ref={chatHistoryRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        )).reverse()}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatModal;
