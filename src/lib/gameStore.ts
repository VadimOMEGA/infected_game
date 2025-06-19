import { GAME_CONFIG } from '@/config/gameConfig'
import { getRandomGameSet } from '@/constants/gameSets'
import type { Role } from '@/types/game'

import type { Player } from '@/types/player'

class GameStore {
	players: Map<string, Player> = new Map()
	private currentQuestionIndex = 0
	private questions = [
        "What's your favorite color?",
        "What did you have for breakfast?",
        "What's your dream vacation destination?",
        "What's your favorite movie genre?"
    ]
	private currentGameSet: string | null = null

	// Room management
	getRoomKey(): string {
		return GAME_CONFIG.ROOM_KEY
	}

	canJoinRoom(roomKey: string): boolean {
		return roomKey === GAME_CONFIG.ROOM_KEY && this.players.size < GAME_CONFIG.MAX_PLAYERS
	}

	// Player management
	addPlayer(id: string, nickname: string, roomKey?: string): boolean {
		if (roomKey && !this.canJoinRoom(roomKey)) {
			return false
		}

		if (this.players.size >= GAME_CONFIG.MAX_PLAYERS) {
			return false
		}

		this.players.set(id, { id, nickname, ready: false })
		return true
	}

	removePlayer(id: string) {
		this.players.delete(id)
	}

	setPlayerReady(id: string, ready: boolean): boolean {
		const player = this.players.get(id)
		if (player) {
			player.ready = ready
			return true
		}
		return false
	}

	getPlayers() {
		return Array.from(this.players.values())
	}

	getPlayer(id: string): Player | undefined {
		return this.players.get(id)
	}

	// Game state checks
	isRoomFull(): boolean {
		return this.players.size >= GAME_CONFIG.MAX_PLAYERS
	}

	areAllPlayersReady(): boolean {
		if (this.players.size === 0) return false
		return Array.from(this.players.values()).every(player => player.ready)
	}

	canStartGame(): boolean {
		return this.isRoomFull() && this.areAllPlayersReady()
	}

	// Game info
	getGameInfo() {
		return {
			playersCount: this.players.size,
			maxPlayers: GAME_CONFIG.MAX_PLAYERS,
			roomKey: GAME_CONFIG.ROOM_KEY,
			canStart: this.canStartGame(),
			roomFull: this.isRoomFull(),
			allReady: this.areAllPlayersReady()
		}
	}

	// Role management
	assignRoles(): { playerId: string; role: Role }[] {
        const playerIds = Array.from(this.players.keys())
        const assignments: { playerId: string; role: Role }[] = []
        
        if (playerIds.length === 0) {
            return assignments
        }
        
        // Randomly select one player to be infected
        const infectedIndex = Math.floor(Math.random() * playerIds.length)
        
        playerIds.forEach((playerId, index) => {
            const role: Role = index === infectedIndex ? 'INFECTED' : 'HEALTHY'
            
            // Update player in store
            const player = this.players.get(playerId)
            if (player) {
                (player as any).role = role // Add role to player object
            }
            
            assignments.push({ playerId, role })
            console.log(`🎭 Assigned ${role} to player ${playerId}`)
        })
        
        return assignments
    }

	selectRandomGameSet(): string {
        this.currentGameSet = getRandomGameSet()
        console.log('🎯 Selected game set:', this.currentGameSet)
        return this.currentGameSet
    }
    
    // ✅ Updated question management
    resetQuestions(): void {
        this.currentQuestionIndex = 0
        this.resetPlayersQuestionReady()
    }

    getCurrentQuestionData(): { question: string; number: number; total: number } {
        return {
            question: this.questions[this.currentQuestionIndex] || "No more questions",
            number: this.currentQuestionIndex + 1,
            total: this.questions.length
        }
    }
    
    nextQuestion(): string | null {
        this.currentQuestionIndex++
        if (this.currentQuestionIndex < this.questions.length) {
            return this.questions[this.currentQuestionIndex]
        }
        return null
    }
    
    getCurrentQuestionNumber(): number {
        return this.currentQuestionIndex + 1
    }
    
    getTotalQuestions(): number {
        return this.questions.length
    }

    hasMoreQuestions(): boolean {
        return this.currentQuestionIndex < this.questions.length - 1
    }

	// ✅ New method for question ready status
    setPlayerQuestionReady(id: string, ready: boolean): boolean {
        const player = this.players.get(id)
        if (player) {
            (player as any).questionReady = ready
            return true
        }
        return false
    }

    // ✅ Reset all players' question ready status
    resetPlayersQuestionReady(): void {
        this.players.forEach(player => {
            (player as any).questionReady = false
        })
    }

    setPlayerVotingReady(id: string, ready: boolean): boolean {
        const player = this.players.get(id)
        if (player) {
            (player as any).votingReady = ready
            return true
        }
        return false
    }

    resetPlayersVotingReady(): void {
        this.players.forEach(player => {
            (player as any).votingReady = false
        })
    }

    getPlayersWithRoles() {
        return Array.from(this.players.values()).map(player => ({
            id: player.id,
            nickname: player.nickname,
            role: (player as any).role || 'HEALTHY'
        }))
    }
}

const gameStore = new GameStore()
export default gameStore
