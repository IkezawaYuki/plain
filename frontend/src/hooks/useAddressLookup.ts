import { useState } from 'react'
import { POSTAL_CODE_API_ENDPOINT } from '../constants/checkout'

export const useAddressLookup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isFound, setIsFound] = useState(false)

  const fetchAddress = async (postalCode: string): Promise<string | null> => {
    if (postalCode.length !== 7) return null

    setIsLoading(true)
    setIsFound(false)

    try {
      const response = await fetch(`${POSTAL_CODE_API_ENDPOINT}?zipcode=${postalCode}`)
      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        const fullAddress = `${result.address1}${result.address2}${result.address3}`
        setIsFound(true)
        return fullAddress
      }
      return null
    } catch (error) {
      console.error('住所取得エラー:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    fetchAddress,
    isLoading,
    isFound,
    setIsFound
  }
}