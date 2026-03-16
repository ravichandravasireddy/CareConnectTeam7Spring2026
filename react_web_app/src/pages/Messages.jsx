import { useState } from 'react'
import '../components/Button.css'
import './Messages.css'

const conversations = [
  { id: '1', name: 'Margaret Johnson', lastMessage: 'Thank you for the reminder!', time: '10:30 AM' },
]

const messages = [
  { sender: 'Margaret Johnson', text: 'Good morning! I just completed my morning vitals check.', time: '10:15 AM' },
  { sender: 'You', text: 'Wonderful! Your blood pressure looks great today. Keep up the good work!', time: '10:20 AM' },
  { sender: 'Margaret Johnson', text: 'Thank you for the reminder!', time: '10:30 AM' },
]

export default function Messages() {
  const [messageInput, setMessageInput] = useState('')
  const [selectedConversation, setSelectedConversation] = useState('1')

  return (
    <div role="main" className="messages-layout">
      <header role="banner" className="messages-header">
        <h2 className="page-title">Secure Messaging</h2>
        <p className="page-subtitle">
          HIPAA-compliant messaging system with real-time communication and multimedia support.
        </p>
      </header>

      <div className="messages-container">
        <aside role="complementary" aria-label="Conversations list" className="conversations-sidebar">
          <div role="list" className="conversations-list">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                type="button"
                role="listitem"
                className={`conversation-item ${selectedConversation === conv.id ? 'conversation-item--active' : ''}`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <span className="conversation-item__name">{conv.name}</span>
                <span className="conversation-item__preview">{conv.lastMessage}</span>
                <span className="conversation-item__time">{conv.time}</span>
              </button>
            ))}
          </div>
        </aside>

        <section role="region" aria-label="Chat messages" className="chat-area">
          <header className="chat-header">
            <h3 className="chat-header__title">Margaret Johnson</h3>
          </header>
          <div
            role="log"
            aria-live="polite"
            aria-label="Message history"
            className="message-history"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.sender === 'You' ? 'message--sent' : 'message--received'}`}
              >
                <span className="message__sender">{msg.sender}</span>
                <p className="message__text">{msg.text}</p>
                <time className="message__time">{msg.time}</time>
              </div>
            ))}
          </div>
          <footer className="chat-footer">
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="message-input"
              aria-label="Message input"
            />
            <button
              type="button"
              className="btn btn--primary"
              aria-label="Send message"
            >
              Send
            </button>
          </footer>
        </section>
      </div>
    </div>
  )
}
