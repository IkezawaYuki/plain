import React from 'react'
import { PLANS } from '../constants/checkout'
import sdLogo from '../assets/sd.png'

export const ProductSection: React.FC = () => {
  return (
    <div className="product-section">
      <div className="product-content">
        <div className="product-header">
          <div className="product-title-container">
            <img src={sdLogo} alt="A-Root Logo" className="product-logo" />
            <h1 className="product-title">A-Root</h1>
          </div>
          <p className="product-subtitle">
            コンテンツ管理の負担を軽減。A-Rootで効率的な情報発信を始めませんか。
          </p>
        </div>

        <div className="product-features">
          <ul className="feature-list">
            {/* 必要に応じて機能リストをここに追加 */}
          </ul>
        </div>

        <div className="product-pricing">
          <h3 className="pricing-title">料金プラン</h3>
          <div className="pricing-options">
            <div className="pricing-option">
              <div className="pricing-plan-name">{PLANS.MONTHLY.name}</div>
              <div>
                <span className="pricing-plan-price">{PLANS.MONTHLY.displayPrice}</span>
              </div>
            </div>
            <div className="pricing-option">
              <div className="pricing-plan-name">{PLANS.YEARLY.name}</div>
              <div>
                <span className="pricing-plan-price">{PLANS.YEARLY.displayPrice}</span>
                <span className="pricing-plan-discount">{PLANS.YEARLY.discount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}