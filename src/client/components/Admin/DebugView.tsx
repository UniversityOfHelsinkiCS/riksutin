/* eslint-disable no-alert */
import { useEffect, useRef, useState } from 'react'

// in the order "Refresh all" runs them: high risk is calculated from the data before it
const CACHES = [
  {
    title: 'Units',
    description: 'University finance units from gw.api.helsinki.fi.',
    url: '/api/faculties/cache/flush',
  },
  {
    title: 'Countries',
    description: 'World Bank country list and EU sanctions (sanctionsmap.eu).',
    url: '/api/countries/cache/flush',
  },
  {
    title: 'Per-country data',
    description:
      'Travel safety level (um.fi) and universities (whed.net) for every country. Takes several minutes, shows the countries that failed.',
    url: '/api/countries/cache/debug',
  },
  {
    title: 'High risk countries',
    description:
      'Recalculated from the cached data above, fetches nothing. Run this after refreshing Countries or Per-country data.',
    url: '/api/countries/cache/highrisk',
  },
]

const cellStyle = { borderBottom: '1px solid #ddd', padding: '12px 8px', textAlign: 'left' as const }

const cacheButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#198754',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px',
}

const AdminDebugView = () => {
  const [messages, setMessages] = useState<{ type: 'success' | 'error'; text: string; timestamp: number }[]>([])

  const addMessage = (type: 'success' | 'error', text: string) => {
    const newMessage = { type, text, timestamp: Date.now() }
    setMessages(prev => [...prev, newMessage].slice(-10))
  }

  // keep the newest message in view
  const messagesRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight })
  }, [messages])
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
    addMessage('error', 'Frontend explosion, see the console')
    throw new Error('frontti paskana')
  }

  const refreshCache = async ({ title, url }: (typeof CACHES)[number]) => {
    try {
      const response = await fetch(url, { method: 'GET' })
      const body = await response.text()

      if (response.ok) {
        addMessage('success', `${title} refreshed: ${body}`)
      } else {
        addMessage('error', `Failed to refresh ${title}: ${response.statusText}`)
      }
      return response.ok
    } catch (error) {
      addMessage('error', `Error refreshing ${title}: ${error}`)
      return false
    }
  }

  const handleRefreshCache = async (cache: (typeof CACHES)[number]) => {
    if (!window.confirm(`Refresh ${cache.title} now?`)) {
      return
    }
    await refreshCache(cache)
  }

  const handleRefreshAll = async () => {
    if (!window.confirm('Refresh all caches now? This takes several minutes.')) {
      return
    }
    for (const cache of CACHES) {
      // one at a time on purpose, high risk is calculated from the data refreshed before it
      // eslint-disable-next-line no-await-in-loop
      if (!(await refreshCache(cache))) {
        return
      }
    }
  }

  const handleStateMonitor = async () => {
    if (!window.confirm('Run state monitor job now? This will send emails if stale entries are found.')) {
      return
    }
    try {
      const response = await fetch('/api/debug/state-monitor', { method: 'POST' })
      if (response.ok) {
        addMessage('success', 'State monitor job completed')
      } else {
        addMessage('error', `Failed to run state monitor: ${response.statusText}`)
      }
    } catch (error) {
      addMessage('error', `Error running state monitor: ${error}`)
    }
  }

  const handleStateMonitorMonthly = async () => {
    if (!window.confirm('Run monthly (expert group) state monitor check now?')) {
      return
    }
    try {
      const response = await fetch('/api/debug/state-monitor-monthly', { method: 'POST' })
      if (response.ok) {
        addMessage('success', 'State monitor monthly check completed')
      } else {
        addMessage('error', `Failed to run monthly check: ${response.statusText}`)
      }
    } catch (error) {
      addMessage('error', `Error running monthly check: ${error}`)
    }
  }

  const handleTestEmail = async () => {
    if (!window.confirm('Send test email to matti.luukkainen@helsinki.fi?')) {
      return
    }
    try {
      const response = await fetch('/api/debug/test-email', { method: 'POST' })
      if (response.ok) {
        addMessage('success', 'Test email sent to matti.luukkainen@helsinki.fi')
      } else {
        addMessage('error', `Failed to send test email: ${response.statusText}`)
      }
    } catch (error) {
      addMessage('error', `Error sending test email: ${error}`)
    }
  }

  const handleSeedDatabase = async () => {
    if (!window.confirm('Are you sure you want to seed the database? This will add default data.')) {
      return
    }
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      })

      if (response.ok) {
        addMessage('success', 'Database seeded successfully')
      } else {
        addMessage('error', `Failed to seed database: ${response.statusText}`)
      }
    } catch (error) {
      addMessage('error', `Error seeding database: ${error}`)
    }
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Acual admin view</h2>

      {messages.length > 0 && (
        <div style={{ marginBottom: '20px', alignSelf: 'stretch' }}>
          <h3>Messages:</h3>
          <div
            ref={messagesRef}
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
          onClick={handleSeedDatabase}
          style={{
            padding: '10px 15px',
            backgroundColor: '#20c997',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Seed Database
        </button>
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
            marginTop: 20,
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
          onClick={handleStateMonitor}
          style={{
            padding: '10px 15px',
            backgroundColor: '#0d6efd',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: 20,
          }}
        >
          Run State Monitor (weekly)
        </button>
        <button
          onClick={handleStateMonitorMonthly}
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
          Run State Monitor (monthly)
        </button>
        <button
          onClick={handleTestEmail}
          style={{
            padding: '10px 15px',
            backgroundColor: '#0dcaf0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            marginTop: 20,
          }}
        >
          Send Test Email
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: 760, marginTop: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <h3 style={{ margin: 0 }}>Cached data</h3>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#666' }}>
              Refreshed automatically in production: high risk countries on Mondays at 18:00, everything else on Fridays
              at 18:15.
            </p>
          </div>
          <button onClick={handleRefreshAll} style={{ ...cacheButtonStyle, whiteSpace: 'nowrap' }}>
            Refresh all
          </button>
        </div>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: 16, fontSize: 14 }}>
          <tbody>
            {CACHES.map(cache => (
              <tr key={cache.title}>
                <td style={{ ...cellStyle, fontWeight: 600, whiteSpace: 'nowrap' }}>{cache.title}</td>
                <td style={{ ...cellStyle, color: '#444' }}>{cache.description}</td>
                <td style={{ ...cellStyle, textAlign: 'right' }}>
                  <button onClick={() => handleRefreshCache(cache)} style={cacheButtonStyle}>
                    Refresh
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDebugView
