import React from 'react'
import { ProductSection } from './ProductSection'
import { Footer } from './Footer'

export const SuccessPage: React.FC = () => {
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
        <Footer />
      </div>
    </div>
  )
}