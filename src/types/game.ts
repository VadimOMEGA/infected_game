export type GamePhase = 'waiting' | 'role-assignment' | 'question' | 'review' | 'voting' | 'results'
export type Role = 'HEALTHY' | 'INFECTED'

export interface IGameInfo {
  playersCount: number
  maxPlayers: number
  roomKey: string
  canStart: boolean
  roomFull: boolean
  allReady: boolean
}