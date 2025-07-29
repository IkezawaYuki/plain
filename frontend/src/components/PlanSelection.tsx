import React from 'react'
import type { PlanType } from '../types/checkout'
import { PLANS } from '../constants/checkout'

interface PlanSelectionProps {
  selectedPlan: PlanType
  onPlanChange: (plan: PlanType) => void
}

export const PlanSelection: React.FC<PlanSelectionProps> = ({
  selectedPlan,
  onPlanChange
}) => {
  return (
    <div className="plan-selection">
      <label className="plan-label">プランを選択</label>
      <div className="plan-options">
        {/* 月額プラン */}
        <div 
          className={`plan-option ${selectedPlan === PLANS.MONTHLY.id ? "selected" : ""}`}
          onClick={() => onPlanChange(PLANS.MONTHLY.id)}
        >
          <input
            type="radio"
            className="plan-radio"
            name="plan"
            value={PLANS.MONTHLY.id}
            checked={selectedPlan === PLANS.MONTHLY.id}
            onChange={() => onPlanChange(PLANS.MONTHLY.id)}
          />
          <div className="plan-content">
            <div className="plan-info">
              <div className="plan-name">{PLANS.MONTHLY.name}</div>
              <div className="plan-description">{PLANS.MONTHLY.description}</div>
            </div>
            <div className="plan-price">{PLANS.MONTHLY.displayPrice}</div>
          </div>
        </div>
        
        {/* 年額プラン */}
        <div 
          className={`plan-option ${selectedPlan === PLANS.YEARLY.id ? "selected" : ""}`}
          onClick={() => onPlanChange(PLANS.YEARLY.id)}
        >
          <input
            type="radio"
            className="plan-radio"
            name="plan"
            value={PLANS.YEARLY.id}
            checked={selectedPlan === PLANS.YEARLY.id}
            onChange={() => onPlanChange(PLANS.YEARLY.id)}
          />
          <div className="plan-content">
            <div className="plan-info">
              <div className="plan-name">{PLANS.YEARLY.name}</div>
              <div className="plan-description">{PLANS.YEARLY.description}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="plan-price">{PLANS.YEARLY.displayPrice}</div>
              <div className="plan-discount">{PLANS.YEARLY.discount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}