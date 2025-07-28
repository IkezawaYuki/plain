import { useState, useEffect, type FormEvent } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js"
import axios from "axios"
import type {
  StripeCardElement,
  PaymentMethodResult,
} from "@stripe/stripe-js"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const stripePromise = loadStripe('pk_test_your_publishable_key_here')

const CheckoutForm: React.FC = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    const {
      error,
      paymentMethod
    }: PaymentMethodResult = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement as StripeCardElement,
    })

    if (error) {
      alert(error.message)
      return
    }

    try {
      const res = await axios.post("http://localhost:8080/api/create-subscription", {
        plan: plan,
        payment_method: paymentMethod?.id,
        email: "user@example.com",
      })

      const { client_secret, status } = res.data

      if (status === "requires_confirmation") {
        const confirmRes = await stripe.confirmCardPayment(client_secret)
        if (confirmRes.error) {
          alert(confirmRes.error.message)
        } else {
          alert("サブスク登録完了！")
        }
      }
    } catch (err: any) {
      alert("エラーが発生しました: " + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <input
            type="radio"
            value="monthly"
            checked={plan === "monthly"}
            onChange={() => setPlan("monthly")}
          />
          月払 ¥2,000
        </label>
        <label>
          <input
            type="radio"
            value="yearly"
            checked={plan === "yearly"}
            onChange={() => setPlan("yearly")}
          />
          年払 ¥19,800（¥1,650/月相当）
        </label>
      </div>

      <div style={{ margin: "1em 0" }}>
        <CardElement />
      </div>

      <button type="submit" disabled={!stripe}>
        プラスプランにアップグレードする
      </button>
    </form>
  )
}

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const fetchHello = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:8080/api/hello')
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
        <h2>Stripe Payment Form:</h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
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
