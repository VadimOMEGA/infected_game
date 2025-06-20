import next from 'next'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

import { GAME_CONFIG } from '@/config/gameConfig'

import gameStore from '@/lib/gameStore'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 10000

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
	const httpServer = createServer(handler)

	const io = new Server(httpServer)

	io.on('connection', socket => {
		console.log('User connected')

		socket.on('join', ({ nickname, roomKey }) => {
			console.log('Join attempt:', { nickname, roomKey, socketId: socket.id })

			const success = gameStore.addPlayer(socket.id, nickname, roomKey)

			if (success) {
				console.log(`✅ Player ${nickname} joined successfully`)
				socket.emit('joinSuccess')

				io.emit('players', gameStore.getPlayers())
				io.emit('gameInfo', gameStore.getGameInfo())
			} else {
				console.log(`❌ Player ${nickname} failed to join`)
				socket.emit('joinError', 'Invalid room key or room is full')
			}
		})

		socket.on('setReady', ready => {
			console.log(`Player ${socket.id} set ready to:`, ready)

			const success = gameStore.setPlayerReady(socket.id, ready)

			if (success) {
				console.log(`✅ Player ready status updated`)
				io.emit('players', gameStore.getPlayers())
				io.emit('gameInfo', gameStore.getGameInfo())

				// Check if all players are ready and can start game
				const players = gameStore.getPlayers()
				const canStart = players.length >= GAME_CONFIG.MAX_PLAYERS && players.every(p => p.ready)

				if (canStart) {
					console.log('🎮 All players ready - starting game!')

					// ✅ Select game set on server
					const gameSet = gameStore.selectRandomGameSet()

					// ✅ Assign roles to all players
					const assignedRoles = gameStore.assignRoles()

					// Send game phase to all players
					io.emit('gamePhase', 'role-assignment')
					io.emit('gameSet', gameSet)

					// Send individual roles to each player
					assignedRoles.forEach(({ playerId, role }) => {
						const playerSocket = io.sockets.sockets.get(playerId)
						if (playerSocket) {
							playerSocket.emit('playerRole', role)
							console.log(`📨 Sent role ${role} to player ${playerId}`)
						}
					})
				}
			} else {
				console.log(`❌ Failed to update ready status for ${socket.id}`)
			}
		})

		socket.on('startQuestions', () => {
			console.log('🎯 Starting question phase requested by client')

			// ✅ Reset question state and start first question
			gameStore.resetQuestions()

			io.emit('gamePhase', 'question')

			// ✅ Send current question with proper format
			const questionData = gameStore.getCurrentQuestionData()
			io.emit('currentQuestion', questionData)
		})

		// ✅ New event for question ready status
		socket.on('questionReady', () => {
			console.log(`Player ${socket.id} is ready for next question`)

			const success = gameStore.setPlayerQuestionReady(socket.id, true)

			if (success) {
				const players = gameStore.getPlayers()
				const allReady = players.every(p => (p as any).questionReady === true)

				// ✅ Send ready status to all players
				io.emit('questionReadyStatus', {
					readyCount: players.filter(p => (p as any).questionReady).length,
					totalPlayers: players.length,
					allReady
				})

				if (allReady) {
					console.log('🎯 All players ready for next question!')

					// ✅ Move to next question
					const nextQuestion = gameStore.nextQuestion()

					if (nextQuestion) {
						// ✅ Reset all players' ready status
						gameStore.resetPlayersQuestionReady()

						// ✅ Send next question
						const questionData = gameStore.getCurrentQuestionData()
						io.emit('currentQuestion', questionData)

						// ✅ Reset ready status
						io.emit('questionReadyStatus', {
							readyCount: 0,
							totalPlayers: players.length,
							allReady: false
						})
					} else {
						// ✅ No more questions - move to voting phase
						console.log('🗳️ Moving to voting phase')
						io.emit('gamePhase', 'voting')
					}
				}
			}
		})

		socket.on('votingReady', () => {
			console.log(`Player ${socket.id} is ready for voting`)

			const success = gameStore.setPlayerVotingReady(socket.id, true)

			if (success) {
				const players = gameStore.getPlayers()
				const allReady = players.every(p => (p as any).votingReady === true)

				// Send ready status to all players
				io.emit('votingReadyStatus', {
					readyCount: players.filter(p => (p as any).votingReady).length,
					totalPlayers: players.length,
					allReady
				})

				if (allReady) {
					console.log('🗳️ All players ready for voting!')

					// ✅ Send all players with their roles for results
					const playersWithRoles = gameStore.getPlayersWithRoles()
					io.emit('gamePhase', 'results')
					io.emit('playersWithRoles', playersWithRoles)
				}
			}
		})

		socket.on('disconnect', () => {
			gameStore.removePlayer(socket.id)
			console.log(`Player with ID ${socket.id} disconnected`)

			// Send the updated player list to everyone
			io.emit('players', gameStore.getPlayers())
		})
	})

	httpServer
		.once('error', err => {
			console.error(err)
			process.exit(1)
		})
		.listen(port, () => {
			console.log(`> Ready on http://${hostname}:${port}`)
		})
})
