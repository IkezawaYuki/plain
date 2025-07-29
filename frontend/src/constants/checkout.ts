export const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_publishable_key_here'

export const PLANS = {
  MONTHLY: {
    id: 'monthly' as const,
    name: '月額プラン',
    description: '毎月の支払い',
    price: 2000,
    displayPrice: '¥2,000'
  },
  YEARLY: {
    id: 'yearly' as const,
    name: '年額プラン', 
    description: '毎年の支払い',
    price: 22000,
    displayPrice: '¥22,000',
    discount: '1ヶ月分お得'
  }
} as const

export const CARD_ELEMENT_OPTIONS = {
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

export const POSTAL_CODE_API_ENDPOINT = 'https://zipcloud.ibsnet.co.jp/api/search'