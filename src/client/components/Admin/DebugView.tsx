/* eslint-disable no-alert */
import * as Sentry from '@sentry/node'
import { useState } from 'react'
import { inProduction } from '@userconfig'

const AdminDebugView = () => {
  const [messages, setMessages] = useState<{ type: 'success' | 'error'; text: string; timestamp: number }[]>([])

  const addMessage = (type: 'success' | 'error', text: string) => {
    const newMessage = { type, text, timestamp: Date.now() }
    setMessages(prev => [newMessage, ...prev].slice(0, 10))
    if (inProduction && type === 'error') {
      Sentry.captureException(text)
    }
  }
  const handleExplode = async () => {
    if (!window.confirm('Are you sure you want to call the explode API?')) {
      return
    }
    try {
      const response = await fetch('/api/explode', {
        method: 'GET',
      })

      if (response.ok) {
        addMessage('success', 'Explode API called successfully')
      } else {
        addMessage('error', `Failed to call explode API: ${response.statusText}`)
      }
    } catch (error) {
      addMessage('error', `Error calling explode API: ${error}`)
    }
  }

  const fronExplosion = () => {
    if (!window.confirm('Are you sure you want to trigger a frontend explosion?')) {
      return
    }
    try {
      throw new Error('frontti paskana')
    } catch (error) {
      addMessage('error', `Frontend explosion: ${error}`)
    }
  }

  const handleCacheCountries = async () => {
    if (!window.confirm('Are you sure you want to cache countries?')) {
      return
    }
    try {
      const response = await fetch('/api/countries/cache', {
        method: 'GET',
      })

      if (response.ok) {
        addMessage('success', 'Countries cache API called successfully')
      } else {
        addMessage('error', `Failed to call countries cache API: ${response.statusText}`)
      }
    } catch (error) {
      addMessage('error', `Error calling countries cache API: ${error}`)
    }
  }

  const handleCacheCountriesAll = async () => {
    if (!window.confirm('Are you sure you want to cache all countries? This may take a while.')) {
      return
    }
    try {
      const response = await fetch('/api/countries/cache?all=true', {
        method: 'GET',
      })

      if (response.ok) {
        addMessage('success', 'Countries cache all API called successfully')
      } else {
        addMessage('error', `Failed to call countries cache all API: ${response.statusText}`)
      }
    } catch (error) {
      addMessage('error', `Error calling countries cache all API: ${error}`)
    }
  }

  const handleCacheHighRisk = async () => {
    if (!window.confirm('Are you sure you want to cache high risk countries?')) {
      return
    }
    try {
      const response = await fetch('/api/countries/cache/highrisk', {
        method: 'GET',
      })

      if (response.ok) {
        addMessage('success', 'High risk countries cache API called successfully')
      } else {
        addMessage('error', `Failed to call high risk countries cache API: ${response.statusText}`)
      }
    } catch (error) {
      addMessage('error', `Error calling high risk countries cache API: ${error}`)
    }
  }

  const handleCacheDebug = async () => {
    if (!window.confirm('Are you sure you want to run cache debug?')) {
      return
    }
    try {
      const response = await fetch('/api/countries/cache/debug', {
        method: 'GET',
      })

      if (response.ok) {
        const result = await response.json()
        addMessage('success', `Countries cache debug API called successfully. Result: ${JSON.stringify(result)}`)
      } else {
        addMessage('error', `Failed to call countries cache debug API: ${response.statusText}`)
      }
    } catch (error) {
      addMessage('error', `Error calling countries cache debug API: ${error}`)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Debug View</h2>

      {messages.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Messages:</h3>
          <div
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '10px',
            }}
          >
            {messages.map(message => (
              <div
                key={message.timestamp}
                style={{
                  padding: '8px 12px',
                  marginBottom: '5px',
                  borderRadius: '4px',
                  backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: message.type === 'success' ? '#155724' : '#721c24',
                  border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                  fontSize: '14px',
                  wordBreak: 'break-word',
                }}
              >
                <small style={{ opacity: 0.7 }}>{new Date(message.timestamp).toLocaleTimeString()}</small>
                <div>{message.text}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setMessages([])}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Clear Messages
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <button
          onClick={handleExplode}
          style={{
            padding: '10px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Backend chaos monkey
        </button>
        <button
          onClick={fronExplosion}
          style={{
            padding: '10px 15px',
            backgroundColor: '#fd7e14',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Frontend chaos monkey
        </button>
        <button
          onClick={handleCacheCountries}
          style={{
            padding: '10px 15px',
            backgroundColor: '#198754',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: 20,
          }}
        >
          Cache Countries
        </button>
        <button
          onClick={handleCacheCountriesAll}
          style={{
            padding: '10px 15px',
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Cache Countries all=true
        </button>
        <button
          onClick={handleCacheHighRisk}
          style={{
            padding: '10px 15px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Cache High Risk Countries
        </button>
        <button
          onClick={handleCacheDebug}
          style={{
            padding: '10px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Cache Debug
        </button>
      </div>
    </div>
  )
}

export default AdminDebugView
