import { User } from "@prisma/client"

interface Entity {
  id: string
  name: string
}

export interface Transaction {
  id: string
  type: string
  details: JSON
  performedBy: User
  targetUser: User | null
  activity: Entity | null
  plan: Entity | null
  diary: Entity | null
  createdAt: string
}
