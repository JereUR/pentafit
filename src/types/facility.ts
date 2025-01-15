export interface WorkingFacility {
  id: string
  name: string
  logoUrl?: string | null
}

export interface FacilityReduceData {
  id: string
  name: string
  description?: string | null
  isActive: boolean
  isWorking: boolean
  logoUrl?: string | null
}

export interface FacilityData {
  id: string
  userId: string
  name: string
  description?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  instagram?: string | null
  facebook?: string | null
  isActive: boolean
  isWorking: boolean
  logoUrl?: string | null
  metadata?: FacilityMetadata | null
}

export interface FacilityMetadata {
  id?: number
  title?: string | null
  primaryColor?: string | null
  secondaryColor?: string | null
  thirdColor?: string | null
  slogan?: string | null
  logoWebUrl?: string | null
}

interface UserFacilityInfo {
  firstName: string
  lastName: string
  avatarUrl: string | null
}

export interface FacilityAllInfo {
  users: UserFacilityInfo[]
  name: string
  description?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  instagram?: string | null
  facebook?: string | null
  isActive: boolean
  isWorking: boolean
  logoUrl?: string | null
  metadata?: FacilityMetadata | null
}
