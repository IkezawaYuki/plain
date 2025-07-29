import React from 'react'
import type { CompanyInfo, FormErrors } from '../types/checkout'
import { useAddressLookup } from '../hooks/useAddressLookup'

interface CustomerInfoFormProps {
  companyInfo: CompanyInfo
  formErrors: FormErrors
  onInputChange: (field: keyof CompanyInfo, value: string) => void
}

export const CustomerInfoForm: React.FC<CustomerInfoFormProps> = ({
  companyInfo,
  formErrors,
  onInputChange
}) => {
  const { fetchAddress, isLoading: postalCodeLoading, isFound: addressFound, setIsFound } = useAddressLookup()

  const handlePostalCodeChange = async (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    onInputChange('postalCode', numericValue)
    
    if (numericValue.length !== 7) {
      setIsFound(false)
    }
    
    if (numericValue.length === 7) {
      const address = await fetchAddress(numericValue)
      if (address) {
        onInputChange('address', address)
      }
    }
  }

  const handleAddressChange = (value: string) => {
    onInputChange('address', value)
    if (addressFound) {
      setIsFound(false)
    }
  }

  return (
    <div className="company-info-section">
      <label className="company-info-title">お客様情報</label>
      <div className="form-grid">
        {/* お名前 */}
        <div className="form-group">
          <label className="form-label required">お名前</label>
          <input
            type="text"
            className={`form-input ${formErrors.name ? 'error' : ''}`}
            placeholder="山田 太郎"
            value={companyInfo.name}
            onChange={(e) => onInputChange('name', e.target.value)}
          />
          {formErrors.name && <div className="form-error">{formErrors.name}</div>}
        </div>

        {/* メールアドレス */}
        <div className="form-group">
          <label className="form-label required">メールアドレス</label>
          <input
            type="email"
            className={`form-input ${formErrors.email ? 'error' : ''}`}
            placeholder="yamada@example.com"
            value={companyInfo.email}
            onChange={(e) => onInputChange('email', e.target.value)}
          />
          {formErrors.email && <div className="form-error">{formErrors.email}</div>}
        </div>

        {/* 企業名 */}
        <div className="form-group">
          <label className="form-label">企業名（任意）</label>
          <input
            type="text"
            className={`form-input ${formErrors.companyName ? 'error' : ''}`}
            placeholder="株式会社サンプル"
            value={companyInfo.companyName}
            onChange={(e) => onInputChange('companyName', e.target.value)}
          />
          {formErrors.companyName && <div className="form-error">{formErrors.companyName}</div>}
        </div>

        {/* 郵便番号 */}
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
                onChange={(e) => handlePostalCodeChange(e.target.value)}
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

        {/* 住所 */}
        <div className="form-group">
          <label className="form-label required">住所</label>
          <input
            type="text"
            className={`form-input ${formErrors.address ? 'error' : ''}`}
            placeholder="東京都渋谷区神宮前1-2-3"
            value={companyInfo.address}
            onChange={(e) => handleAddressChange(e.target.value)}
          />
          {formErrors.address && <div className="form-error">{formErrors.address}</div>}
        </div>

        {/* 建物名・号室 */}
        <div className="form-group">
          <label className="form-label">建物名・号室（任意）</label>
          <input
            type="text"
            className={`form-input ${formErrors.addressLine2 ? 'error' : ''}`}
            placeholder="サンプルビル 101号室"
            value={companyInfo.addressLine2}
            onChange={(e) => onInputChange('addressLine2', e.target.value)}
          />
          {formErrors.addressLine2 && <div className="form-error">{formErrors.addressLine2}</div>}
        </div>
      </div>
    </div>
  )
}