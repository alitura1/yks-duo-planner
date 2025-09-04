export type Role = 'admin' | 'adminpp'
export type SubTheme = typeof themes[number]['id'];

export interface UserProfile {
  id: string
  displayName: string
  email: string
  role: Role
  side: 'left'|'right'
  theme: SubTheme
  photoURL?: string
  statusNote?: string
  statusGifUrl?: string
}

export interface Presence {
  online: boolean
  lastSeen: number | null
}

export interface Task {
  id: string
  ownerUid: string
  date: string // YYYY-MM-DD
  title: string
  done: boolean
  order: number
  createdAt?: any
}

// 🎁 Ödül sistemi tipi
export interface Reward {
  id: string
  userId: string
  name: string
  used: boolean
  createdAt: any
}
