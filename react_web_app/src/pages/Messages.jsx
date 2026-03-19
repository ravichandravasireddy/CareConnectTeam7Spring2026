import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta'
import { SearchIcon, PaperclipIcon, SendIcon, PhoneIcon, VideoIcon, MoreIcon, BackArrowIcon } from '../components/Icons'
import '../components/Button.css'
import './Messages.css'

const conversations = [
  { id: '1', name: 'Margaret Johnson', lastMessage: 'Thank you for the reminder!', time: '10:30 AM', online: true, unread: 0 },
  { id: '2', name: 'Robert Chen', lastMessage: 'I took my medication', time: '9:45 AM', online: true, unread: 2 },
  { id: '3', name: 'Sarah Williams', lastMessage: 'Feeling better today', time: 'Yesterday', online: true, unread: 0 },
  { id: '4', name: 'Dr. Patricia Lee', lastMessage: 'Lab results are in', time: 'Yesterday', online: false, unread: 1 },
]

const messages = [
  { sender: 'Margaret Johnson', text: 'Good morning! I just completed my morning vitals check.', time: '10:15 AM' },
  { sender: 'You', text: 'Wonderful! Your blood pressure looks great today. Keep up the good work!', time: '10:20 AM' },
  { sender: 'Margaret Johnson', text: 'Thank you for the reminder!', time: '10:30 AM' },
]

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Messages() {
  const [messageInput, setMessageInput] = useState('')
  const [selectedConversation, setSelectedConversation] = useState('1')
  const [searchQuery, setSearchQuery] = useState('')
  const conversationRefs = useRef({})
  const searchInputRef = useRef(null)
  const messageInputRef = useRef(null)
  const shouldFocusMessage = useRef(false)

  const selected = conversations.find((c) => c.id === selectedConversation)
  const filteredConversations = searchQuery
    ? conversations.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations

  // Focus the message input only on click/Enter selection, not Tab
  useEffect(() => {
    if (shouldFocusMessage.current) {
      messageInputRef.current?.focus()
      shouldFocusMessage.current = false
    }
  }, [selectedConversation])

  const selectConversation = (id) => {
    shouldFocusMessage.current = true
    setSelectedConversation(id)
  }

  const handleConversationKeyDown = (e, convId) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      searchInputRef.current?.focus()
    }
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setSearchQuery('')
      searchInputRef.current?.blur()
    }
  }

  return (
    <>
      <PageMeta
        title="Secure Messages – CareConnect"
        description="Send and receive HIPAA-compliant messages with patients and care teams."
        path="/messages"
      />
      <div role="main" className="messages-layout">
        <header role="banner" className="messages-page-header">
          <nav aria-label="Back navigation">
            <Link to="/" className="back-link" aria-label="Back to dashboard">
              <BackArrowIcon size={20} />
              Messages
            </Link>
          </nav>
          <button type="button" className="btn btn--primary" aria-label="Start new message">
            New Message
          </button>
        </header>

        <div className="messages-container">
          <aside role="complementary" aria-label="Conversations list" className="conversations-sidebar">
            <form aria-label="Search conversations" className="conversations-search">
              <SearchIcon size={18} className="conversations-search__icon" aria-hidden="true" />
              <label htmlFor="search-messages" className="sr-only">
                Search messages
              </label>
              <input
                id="search-messages"
                type="search"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                ref={searchInputRef}
                className="conversations-search__input"
              />
            </form>
            <div role="list" className="conversations-list">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  role="listitem"
                  className={`conversation-item ${selectedConversation === conv.id ? 'conversation-item--active' : ''}`}
                  onClick={() => selectConversation(conv.id)}
                  onKeyDown={(e) => handleConversationKeyDown(e, conv.id)}
                  ref={(el) => { conversationRefs.current[conv.id] = el }}
                  tabIndex={0}
                  aria-current={selectedConversation === conv.id ? 'true' : undefined}
                  aria-label={`Conversation with ${conv.name}${conv.unread ? `, ${conv.unread} unread` : ''}`}
                >
                  <div className="conversation-item__avatar-wrap">
                    <span className="conversation-item__avatar" aria-hidden="true">
                      {getInitials(conv.name)}
                    </span>
                    {conv.online && (
                      <span className="conversation-item__online" aria-hidden="true" />
                    )}
                  </div>
                  <div className="conversation-item__content">
                    <span className="conversation-item__name">{conv.name}</span>
                    <span className="conversation-item__preview">{conv.lastMessage}</span>
                </div>
                  <div className="conversation-item__meta">
                    <span className="conversation-item__time">{conv.time}</span>
                    {conv.unread > 0 && (
                      <span className="conversation-item__unread" aria-label={`${conv.unread} unread`}>
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section role="region" aria-label="Chat messages" className="chat-area">
            <header className="chat-header">
              <div className="chat-header__back">
                <span className="chat-header__avatar" aria-hidden="true">
                  {selected ? getInitials(selected.name) : '—'}
                </span>
                <div>
                  <h2 className="chat-header__title">{selected?.name || 'Select a conversation'}</h2>
                  <span className="chat-header__status">{selected?.online ? 'Online' : 'Offline'}</span>
                </div>
              </div>
              <div className="chat-header__actions">
                <button type="button" className="chat-header__action" aria-label="Call">
                  <PhoneIcon size={20} />
                </button>
                <button type="button" className="chat-header__action" aria-label="Video call">
                  <VideoIcon size={20} />
                </button>
                <button type="button" className="chat-header__action" aria-label="More options">
                  <MoreIcon size={20} />
                </button>
              </div>
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
                  {msg.sender !== 'You' && (
                    <span className="message__sender">{msg.sender}</span>
                  )}
                  <p className="message__text">{msg.text}</p>
                  <time className="message__time">{msg.time}</time>
                </div>
              ))}
            </div>

            <footer className="chat-footer">
              <form aria-label="Send a message" className="chat-footer__form" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="message-input" className="sr-only">
                  Type a message
                </label>
                <button type="button" className="chat-footer__attach" aria-label="Attach file">
                  <PaperclipIcon size={20} />
                </button>
                <input
                  id="message-input"
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  ref={messageInputRef}
                  className="message-input"
                />
                <button
                  type="submit"
                  className="chat-footer__send"
                  aria-label="Send message"
                >
                  <SendIcon size={20} />
                </button>
              </form>
            </footer>
          </section>
        </div>
      </div>
    </>
  )
}
