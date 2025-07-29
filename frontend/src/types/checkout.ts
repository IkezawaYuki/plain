export interface CompanyInfo {
  name: string
  email: string
  companyName: string
  postalCode: string
  address: string
  addressLine2: string
}

export type PlanType = "monthly" | "yearly"

export interface FormErrors extends Partial<CompanyInfo> {}