import React, { useState, type FormEvent } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js'
import axios from 'axios'
import type { PaymentMethodResult } from '@stripe/stripe-js'

// 型定義とカスタムフック
import type { CompanyInfo, PlanType } from './types/checkout'
import { useFormValidation } from './hooks/useFormValidation'
import { STRIPE_PUBLISHABLE_KEY } from './constants/checkout'

// コンポーネント
import { ProductSection } from './components/ProductSection'
import { PlanSelection } from './components/PlanSelection'
import { CustomerInfoForm } from './components/CustomerInfoForm'
import { PaymentSection } from './components/PaymentSection'
import { Footer } from './components/Footer'
import { SuccessPage } from './components/SuccessPage'

import './App.css'
import './Checkout.css'

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

const CheckoutForm: React.FC = () => {
  // Stripe hooks
  const stripe = useStripe()
  const elements = useElements()

  // ===== TEST API CALL - DELETE THIS SECTION =====
  React.useEffect(() => {
    const testApiCall = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        const response = await axios.get(`${apiUrl}/api/hello`)
        console.log('API Response:', response.data.message)
      } catch (error) {
        console.error('API Error:', error)
      }
    }
    testApiCall()
  }, [])
  // ===== END TEST SECTION =====
  
  // State management
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    email: '',
    companyName: '',
    postalCode: '',
    address: '',
    addressLine2: ''
  })

  // カスタムフック
  const { errors: formErrors, validateForm, clearError } = useFormValidation()

  // フォーム入力ハンドラー
  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }))
    clearError(field)
  }

  // プラン変更ハンドラー
  const handlePlanChange = (plan: PlanType) => {
    setSelectedPlan(plan)
  }

  // 決済処理
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // フォームバリデーション
    if (!validateForm(companyInfo)) {
      setLoading(false)
      return
    }

    if (!stripe || !elements) {
      setLoading(false)
      return
    }

    // カード要素の取得
    const cardNumberElement = elements.getElement(CardNumberElement)
    if (!cardNumberElement) {
      setLoading(false)
      return
    }

    try {
      // PaymentMethodの作成
      const { error: paymentError, paymentMethod }: PaymentMethodResult = 
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardNumberElement,
        })

      if (paymentError) {
        setError(paymentError.message || 'カード情報に問題があります')
        setLoading(false)
        return
      }

      // サブスクリプション作成API呼び出し
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      const response = await axios.post(`${apiUrl}/api/create-subscription`, {
        plan: selectedPlan,
        payment_method: paymentMethod?.id,
        name: companyInfo.name,
        email: companyInfo.email,
        company_name: companyInfo.companyName,
        postal_code: companyInfo.postalCode,
        address: companyInfo.address,
        address_line2: companyInfo.addressLine2,
      })

      const { client_secret, status } = response.data

      // 必要に応じて決済確認
      if (status === 'requires_confirmation') {
        const confirmResult = await stripe.confirmCardPayment(client_secret)
        if (confirmResult.error) {
          setError(confirmResult.error.message || '決済に失敗しました')
        } else {
          setSuccess(true)
        }
      } else {
        setSuccess(true)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error && 'response' in err && 
        typeof err.response === 'object' && err.response !== null &&
        'data' in err.response && typeof err.response.data === 'object' && 
        err.response.data !== null && 'message' in err.response.data
        ? String(err.response.data.message)
        : '決済処理中にエラーが発生しました'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // 成功画面の表示
  if (success) {
    return <SuccessPage />
  }

  // メインのチェックアウトフォーム
  return (
    <div className="checkout-layout">
      <ProductSection />
      <div className="checkout-container">
        <div className="checkout-form-wrapper">
          <div className="checkout-header">
            <h2 className="checkout-title">お支払い情報</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <PlanSelection
              selectedPlan={selectedPlan}
              onPlanChange={handlePlanChange}
            />

            <CustomerInfoForm
              companyInfo={companyInfo}
              formErrors={formErrors}
              onInputChange={handleInputChange}
            />

            <PaymentSection
              selectedPlan={selectedPlan}
              loading={loading}
              error={error}
              onSubmit={handleSubmit}
              stripe={stripe}
            />
          </form>
        </div>
        
        <Footer />
      </div>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}

export default App