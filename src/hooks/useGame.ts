import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSocket } from './useSocket'
import type { GamePhase, IGameInfo, Role } from '@/types/game'
import type { Player } from '@/types/player'

export function useGame() {
	const { socket, isConnected } = useSocket()

	// Game state
	const [gamePhase, setGamePhase] = useState<GamePhase>('waiting')
	const [hasJoined, setHasJoined] = useState(false)
	const [joinError, setJoinError] = useState<string | null>(null)
	const [isJoining, setIsJoining] = useState(false)

	// Player data
	const [playerRole, setPlayerRole] = useState<Role | null>(null)
	const [players, setPlayers] = useState<Player[]>([])
	const [gameInfo, setGameInfo] = useState<IGameInfo | null>(null)

	// Game set state
	const [gameSet, setGameSet] = useState<string | null>(null)

	// Question/Answer data
	const [currentQuestion, setCurrentQuestion] = useState<string>('')
	const [questionNumber, setQuestionNumber] = useState(0)
	const [answers, setAnswers] = useState<Record<string, string[]>>({})
	const [questionReadyStatus, setQuestionReadyStatus] = useState({
		readyCount: 0,
		totalPlayers: 0,
		allReady: false
	})

	// Voting data
	const [votes, setVotes] = useState<Record<string, string>>({})
	const [gameResults, setGameResults] = useState<any>(null)
	const [votingReadyStatus, setVotingReadyStatus] = useState({
		readyCount: 0,
		totalPlayers: 0,
		allReady: false
	})

	const [playersWithRoles, setPlayersWithRoles] = useState<
		Array<{
			id: string
			nickname: string
			role: 'INFECTED' | 'HEALTHY'
		}>
	>([])

	useEffect(() => {
		socket.on('playersWithRoles', players => {
			console.log('📊 Received players with roles:', players)
			setPlayersWithRoles(players)
		})

		// Join related events
		socket.on('joinSuccess', () => {
			setIsJoining(false)
			setHasJoined(true)
			setJoinError(null)
		})

		socket.on('joinError', (error: string) => {
			setIsJoining(false)
			setJoinError(error)
			setHasJoined(false)
		})

		// Game state events
		socket.on('gamePhase', (phase: GamePhase) => {
			setGamePhase(phase)
		})

		socket.on('players', (playersList: Player[]) => {
			setPlayers(playersList)
		})

		socket.on('gameInfo', (info: IGameInfo) => {
			setGameInfo(info)
		})

		socket.on('gameSet', (gameSet: string) => {
			console.log('🎯 Received game set:', gameSet)
			setGameSet(gameSet)
		})

		// Role assignment
		socket.on('playerRole', (role: Role) => {
			setPlayerRole(role)
		})

		// Question phase events
		socket.on(
			'currentQuestion',
			(questionData: { question: string; number: number; total: number }) => {
				console.log('📋 Received question data:', questionData)
				setCurrentQuestion(questionData.question)
				setQuestionNumber(questionData.number)
			}
		)

		// ✅ Add question ready status listener
		socket.on('questionReadyStatus', status => {
			setQuestionReadyStatus(status)
		})

		// Review phase - all answers
		socket.on('allAnswers', (answersData: Record<string, string[]>) => {
			setAnswers(answersData)
		})

		// Voting phase
		socket.on('votingResults', (votesData: Record<string, string>) => {
			setVotes(votesData)
		})

		socket.on('votingReadyStatus', status => {
			setVotingReadyStatus(status)
		})

		// Game results
		socket.on('gameResults', (results: any) => {
			setGameResults(results)
		})

		// Cleanup listeners
		return () => {
			socket.off('joinSuccess')
			socket.off('joinError')
			socket.off('gamePhase')
			socket.off('players')
			socket.off('gameInfo')
			socket.off('playerRole')
			socket.off('currentQuestion')
			socket.off('allAnswers')
			socket.off('votingResults')
			socket.off('gameResults')
			socket.off('gameSet')
			socket.off('questionReadyStatus')
		}
	}, [socket])

	// Game actions
	const joinRoom = useCallback(
		(nickname: string, roomKey: string) => {
			if (!isConnected) return

			setIsJoining(true)
			socket.emit('join', { nickname, roomKey })
		},
		[socket, isConnected]
	)

	const setReady = useCallback(
		(ready: boolean) => {
			if (!isConnected || !hasJoined) return
			socket.emit('setReady', ready)
		},
		[socket, isConnected, hasJoined]
	)

	const startQuestions = useCallback(() => {
		if (!isConnected || !hasJoined) return
		console.log('🎯 Requesting to start questions')
		socket.emit('startQuestions')
	}, [socket, isConnected, hasJoined])

	const setQuestionReady = useCallback(() => {
		if (!isConnected || !hasJoined) return
		console.log('✅ Player ready for next question')
		socket.emit('questionReady')
	}, [socket, isConnected, hasJoined])

	const submitAnswer = useCallback(
		(answer: string) => {
			if (!isConnected || !hasJoined) return
			socket.emit('submitAnswer', answer)
		},
		[socket, isConnected, hasJoined]
	)

	const submitVote = useCallback(
		(targetPlayerId: string) => {
			if (!isConnected || !hasJoined) return
			socket.emit('submitVote', targetPlayerId)
		},
		[socket, isConnected, hasJoined]
	)

	const setVotingReady = useCallback(() => {
		if (!isConnected || !hasJoined) return
		console.log('✅ Player ready for voting')
		socket.emit('votingReady')
	}, [socket, isConnected, hasJoined])

	const startNewGame = useCallback(() => {
		if (!isConnected) return
		socket.emit('startNewGame')
	}, [socket, isConnected])

	// Helper functions
	const getCurrentPlayer = useCallback((): Player | undefined => {
		return players.find(player => player.id === socket.id)
	}, [players, socket.id])

	const isPlayerReady = useCallback((): boolean => {
		const player = getCurrentPlayer()
		return player?.ready || false
	}, [getCurrentPlayer])

	return useMemo(
		() => ({
			// Game state
			gamePhase,
			hasJoined,
			joinError,
			isConnected,
			isJoining,
			playersWithRoles,

			// Player data
			playerRole,
			players,
			gameInfo,

			// Game set state
			gameSet,

			// Question/Answer data
			currentQuestion,
			questionNumber,
			answers,
			questionReadyStatus,
			setQuestionReady,

			// Voting data
			votes,
			gameResults,
			votingReadyStatus,
			setVotingReady,

			// Actions
			joinRoom,
			setReady,
			submitAnswer,
			submitVote,
			startNewGame,
			startQuestions,

			// Helpers
			getCurrentPlayer,
			isPlayerReady
		}),
		[
			// Dependencies - all values that can change
			gamePhase,
			hasJoined,
			joinError,
			isConnected,
			isJoining,
			playerRole,
			players,
			gameInfo,
			gameSet,
			currentQuestion,
			questionNumber,
			answers,
			votes,
			gameResults,
			joinRoom,
			setReady,
			submitAnswer,
			submitVote,
			startNewGame,
			startQuestions,
			getCurrentPlayer,
			isPlayerReady,
			questionReadyStatus,
			setQuestionReady,
			votingReadyStatus,
			setVotingReady,
			playersWithRoles,
		]
	)
}
