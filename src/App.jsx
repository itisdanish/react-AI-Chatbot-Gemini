import { useState } from 'react';
import styles from './App.module.css';
import { Chat } from './components/Chat/Chat';
import { Controls } from './components/controls/Controls';
import { GoogleGenerativeAI } from '@google/generative-ai';

const googleai = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);
const gemini = googleai.getGenerativeModel({ model: 'gemini-1.5-flash' });
const chat = gemini.startChat({ history: [] });

function App() {
  const [messages, setMessages] = useState([]);

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    setMessages((prevMessages) => [...prevMessages, { content, role: 'user' }]);
    try {
      const result = await chat.sendMessage(content);
      addMessage({ content: result.response.text(), role: 'assistant' });
    } catch (error) {
      addMessage({
        content: "Sorry, I couldn't process your request, please try again",
        role: 'system',
      });
    }
  }

  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img src='/robot.png' className={styles.Logo} alt='' srcset='' />
        <h1 className={styles.Title}>AI Chatboots</h1>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls onSend={handleContentSend} />
    </div>
  );
}

export default App;
