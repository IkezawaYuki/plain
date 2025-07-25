import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const fetchHello = async () => {
    setLoading(true)
    setError('')
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      const response = await fetch(`${apiUrl}/api/hello`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setMessage(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHello()
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      
      <div className="card">
        <h2>API Response:</h2>
        {loading && <p>Loading...</p>}
        {error && <p style={{color: 'red'}}>Error: {error}</p>}
        {message && <p style={{color: 'green', fontSize: '18px'}}>{message}</p>}
        <button onClick={fetchHello} disabled={loading}>
          Refresh API Call
        </button>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
