import { useState } from 'react'
import type { CompanyInfo, FormErrors } from '../types/checkout'

export const useFormValidation = () => {
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (companyInfo: CompanyInfo): boolean => {
    const newErrors: FormErrors = {}
    
    // 名前の検証
    if (!companyInfo.name.trim()) {
      newErrors.name = 'お名前は必須です'
    }
    
    // メールアドレスの検証
    if (!companyInfo.email.trim()) {
      newErrors.email = 'メールアドレスは必須です'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyInfo.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }
    
    // 郵便番号の検証
    if (!companyInfo.postalCode.trim()) {
      newErrors.postalCode = '郵便番号は必須です'
    } else if (!/^\d{7}$/.test(companyInfo.postalCode)) {
      newErrors.postalCode = '郵便番号は7桁の数字で入力してください'
    }
    
    // 住所の検証
    if (!companyInfo.address.trim()) {
      newErrors.address = '住所は必須です'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearError = (field: keyof CompanyInfo) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return {
    errors,
    validateForm,
    clearError
  }
}