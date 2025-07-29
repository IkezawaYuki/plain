import React from 'react'
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import type { PlanType } from '../types/checkout'
import { CARD_ELEMENT_OPTIONS, PLANS } from '../constants/checkout'

interface PaymentSectionProps {
  selectedPlan: PlanType
  loading: boolean
  error?: string
  onSubmit: (e: React.FormEvent) => void
  stripe: any
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  selectedPlan,
  loading,
  error,
  onSubmit,
  stripe
}) => {
  const getButtonText = () => {
    if (loading) return '処理中...'
    
    const plan = selectedPlan === 'monthly' ? PLANS.MONTHLY : PLANS.YEARLY
    return `${plan.displayPrice}で申し込み`
  }

  return (
    <>
      {/* カード情報 */}
      <div className="card-section">
        <label className="card-label">支払い方法</label>
        
        {/* カード番号 */}
        <div className="card-field">
          <label className="card-field-label">カード番号</label>
          <div className="card-element-container">
            <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
        
        {/* 有効期限とCVC */}
        <div className="card-row">
          <div className="card-field">
            <label className="card-field-label">有効期限</label>
            <div className="card-element-container">
              <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
          <div className="card-field">
            <label className="card-field-label">セキュリティコード</label>
            <div className="card-element-container">
              <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>
      </div>

      {/* エラーメッセージ */}
      {error && <div className="error-message">{error}</div>}

      {/* 申し込みボタン */}
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="submit-button"
        onClick={onSubmit}
      >
        {loading && <div className="loading-spinner"></div>}
        {getButtonText()}
      </button>

      {/* セキュリティ情報 */}
      <div className="security-info">
        <svg className="security-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <p className="security-text">
          お客様の情報は SSL 暗号化により安全に保護されています
        </p>
      </div>
    </>
  )
}