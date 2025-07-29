import { useState, type FormEvent } from 'react'
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
import sdLogo from './assets/sd.png'
import './App.css'
import './Checkout.css'

const stripePromise = loadStripe('pk_test_your_publishable_key_here')

interface CompanyInfo {
  name: string
  email: string
  companyName: string
  postalCode: string
  address: string
  addressLine2: string
}

const CheckoutForm: React.FC = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly")
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
  const [postalCodeLoading, setPostalCodeLoading] = useState(false)
  const [addressFound, setAddressFound] = useState(false)
  const [formErrors, setFormErrors] = useState<Partial<CompanyInfo>>({})

  // 郵便番号から住所を取得する関数
  const fetchAddressFromPostalCode = async (postalCode: string) => {
    if (postalCode.length !== 7) return

    setPostalCodeLoading(true)
    setAddressFound(false)

    try {
      // 郵便番号APIを使用（zipcloud.ibsnet.co.jp）
      const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`)
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        const fullAddress = `${result.address1}${result.address2}${result.address3}`
        
        setCompanyInfo(prev => ({
          ...prev,
          address: fullAddress
        }))
        setAddressFound(true)
      }
    } catch (error) {
      console.error('住所取得エラー:', error)
    } finally {
      setPostalCodeLoading(false)
    }
  }

  // フォーム入力ハンドラー
  const handleInputChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      [field]: value
    }))
    
    // エラーをクリア
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }

    // 郵便番号の場合は住所を自動取得
    if (field === 'postalCode' && value.length === 7) {
      fetchAddressFromPostalCode(value)
    }
  }

  // バリデーション
  const validateForm = (): boolean => {
    const errors: Partial<CompanyInfo> = {}
    
    if (!companyInfo.name) {
      errors.name = 'お名前は必須です'
    }
    
    if (!companyInfo.email) {
      errors.email = 'メールアドレスは必須です'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyInfo.email)) {
      errors.email = '有効なメールアドレスを入力してください'
    }
    
    // 企業名は任意入力のためバリデーションなし
    
    if (!companyInfo.postalCode) {
      errors.postalCode = '郵便番号は必須です'
    } else if (!/^\d{7}$/.test(companyInfo.postalCode)) {
      errors.postalCode = '郵便番号は7桁の数字で入力してください'
    }
    
    if (!companyInfo.address) {
      errors.address = '住所は必須です'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // フォームバリデーション
    if (!validateForm()) {
      setLoading(false)
      return
    }

    if (!stripe || !elements) {
      setLoading(false)
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setLoading(false)
      return
    }

    const {
      error,
      paymentMethod
    }: PaymentMethodResult = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement as StripeCardElement,
    })

    if (error) {
      setError(error.message || 'カード情報に問題があります')
      setLoading(false)
      return
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
      const res = await axios.post(`${apiUrl}/api/create-subscription`, {
        plan: plan,
        payment_method: paymentMethod?.id,
        name: companyInfo.name,
        email: companyInfo.email,
        company_name: companyInfo.companyName,
        postal_code: companyInfo.postalCode,
        address: companyInfo.address,
        address_line2: companyInfo.addressLine2,
      })

      const { client_secret, status } = res.data

      if (status === "requires_confirmation") {
        const confirmRes = await stripe.confirmCardPayment(client_secret)
        if (confirmRes.error) {
          setError(confirmRes.error.message || '決済に失敗しました')
        } else {
          setSuccess(true)
        }
      } else {
        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "決済処理中にエラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '12px',
        color: '#1f2937',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '::placeholder': {
          color: '#9ca3af',
        },
        iconColor: '#6b7280',
      },
      invalid: {
        color: '#dc2626',
        iconColor: '#dc2626',
      },
    },
  }

  const ProductSection = () => (
    <div className="product-section">
      <div className="product-content">
        <div className="product-header">
          <div className="product-title-container">
            <img src={sdLogo} alt="A-Root Logo" className="product-logo" />
            <h1 className="product-title">A-Root</h1>
          </div>
          <p className="product-subtitle">
            あなたのビジネスを次のレベルへ。プラスプランで、より多くの機能と可能性を手に入れましょう。
          </p>
        </div>

        <div className="product-features">
          <ul className="feature-list">
          </ul>
        </div>

        <div className="product-pricing">
          <h3 className="pricing-title">料金プラン</h3>
          <div className="pricing-options">
            <div className="pricing-option">
              <div className="pricing-plan-name">月額プラン</div>
              <div>
                <span className="pricing-plan-price">¥2,000</span>
              </div>
            </div>
            <div className="pricing-option">
              <div className="pricing-plan-name">年額プラン</div>
              <div>
                <span className="pricing-plan-price">¥22,000</span>
                <span className="pricing-plan-discount">1ヶ月分お得</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (success) {
    return (
      <div className="checkout-layout">
        <ProductSection />
        <div className="checkout-container">
          <div className="checkout-form-wrapper">
            <div className="checkout-header">
              <h2 className="checkout-title">✅ 決済完了</h2>
              <p className="checkout-subtitle">プラスプランへのアップグレードが完了しました</p>
            </div>
            <div className="success-message">
              サブスクリプションの登録が正常に完了しました。ご利用ありがとうございます！
            </div>
          </div>
          
          <footer className="checkout-footer">
            <div className="footer-content">
              <p className="footer-text">© 2024 A-Root. All rights reserved.</p>
              <div className="footer-links">
                <a href="#" className="footer-link">利用規約</a>
                <span className="footer-separator">|</span>
                <a href="#" className="footer-link">プライバシーポリシー</a>
                <span className="footer-separator">|</span>
                <a href="#" className="footer-link">サポート</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-layout">
      <ProductSection />
      <div className="checkout-container">
        <div className="checkout-form-wrapper">
          <div className="checkout-header">
            <h2 className="checkout-title">お支払い情報</h2>
            <p className="checkout-subtitle">安全で簡単な決済プロセス</p>
          </div>

          <form onSubmit={handleSubmit}>
        <div className="plan-selection">
          <label className="plan-label">プランを選択</label>
          <div className="plan-options">
            <div 
              className={`plan-option ${plan === "monthly" ? "selected" : ""}`}
              onClick={() => setPlan("monthly")}
            >
              <input
                type="radio"
                className="plan-radio"
                name="plan"
                value="monthly"
                checked={plan === "monthly"}
                onChange={() => setPlan("monthly")}
              />
              <div className="plan-content">
                <div className="plan-info">
                  <div className="plan-name">月額プラン</div>
                  <div className="plan-description">毎月の支払い</div>
                </div>
                <div className="plan-price">¥2,000</div>
              </div>
            </div>
            
            <div 
              className={`plan-option ${plan === "yearly" ? "selected" : ""}`}
              onClick={() => setPlan("yearly")}
            >
              <input
                type="radio"
                className="plan-radio"
                name="plan"
                value="yearly"
                checked={plan === "yearly"}
                onChange={() => setPlan("yearly")}
              />
              <div className="plan-content">
                <div className="plan-info">
                  <div className="plan-name">年額プラン</div>
                  <div className="plan-description">毎年の支払い</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="plan-price">¥22,000</div>
                  <div className="plan-discount">1ヶ月分お得</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="company-info-section">
          <label className="company-info-title">お客様情報</label>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label required">お名前</label>
              <input
                type="text"
                className={`form-input ${formErrors.name ? 'error' : ''}`}
                placeholder="山田 太郎"
                value={companyInfo.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
              {formErrors.name && <div className="form-error">{formErrors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label required">メールアドレス</label>
              <input
                type="email"
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                placeholder="yamada@example.com"
                value={companyInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              {formErrors.email && <div className="form-error">{formErrors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">企業名（任意）</label>
              <input
                type="text"
                className={`form-input ${formErrors.companyName ? 'error' : ''}`}
                placeholder="株式会社サンプル"
                value={companyInfo.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
              {formErrors.companyName && <div className="form-error">{formErrors.companyName}</div>}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label required">郵便番号</label>
                <div className="postal-code-group">
                  <input
                    type="text"
                    className={`form-input ${formErrors.postalCode ? 'error' : ''}`}
                    placeholder="1234567"
                    maxLength={7}
                    value={companyInfo.postalCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '')
                      handleInputChange('postalCode', value)
                    }}
                  />
                  {postalCodeLoading && <div className="postal-code-loading" />}
                  {addressFound && !postalCodeLoading && <div className="postal-code-success">✓</div>}
                </div>
                {formErrors.postalCode && <div className="form-error">{formErrors.postalCode}</div>}
                {addressFound && (
                  <div className="address-autocomplete">
                    住所が自動入力されました
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">住所</label>
              <input
                type="text"
                className={`form-input ${formErrors.address ? 'error' : ''}`}
                placeholder="東京都渋谷区神宮前1-2-3"
                value={companyInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
              {formErrors.address && <div className="form-error">{formErrors.address}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">建物名・号室（任意）</label>
              <input
                type="text"
                className={`form-input ${formErrors.addressLine2 ? 'error' : ''}`}
                placeholder="サンプルビル 101号室"
                value={companyInfo.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
              />
              {formErrors.addressLine2 && <div className="form-error">{formErrors.addressLine2}</div>}
            </div>
          </div>
        </div>

        <div className="card-section">
          <label className="card-label">カード情報</label>
          <div className="card-element-container">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          disabled={!stripe || loading}
          className="submit-button"
        >
          {loading && <div className="loading-spinner"></div>}
          {loading ? '処理中...' : `${plan === 'monthly' ? '¥2,000' : '¥22,000'}で申し込み`}
        </button>

        <div className="security-info">
          <svg className="security-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <p className="security-text">
            お客様の情報は SSL 暗号化により安全に保護されています
          </p>
        </div>
          </form>
        </div>
        
        <footer className="checkout-footer">
          <div className="footer-content">
            <p className="footer-text">© 2024 A-Root. All rights reserved.</p>
            <div className="footer-links">
              <a href="#" className="footer-link">利用規約</a>
              <span className="footer-separator">|</span>
              <a href="#" className="footer-link">プライバシーポリシー</a>
              <span className="footer-separator">|</span>
              <a href="#" className="footer-link">サポート</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function App() {

  return (
    <>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </>
  )
}

export default App
