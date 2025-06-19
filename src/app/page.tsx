'use client'

import { AnimatePresence } from 'motion/react'

import { useGameContext } from '@/providers/GameProvider'

import {
	QuestionPhase,
	ResultsPhase,
	ReviewPhase,
	RoleReveal,
	RoomEntry,
	VotingPhase,
	WaitingRoom
} from '@/components'

export default function Home() {
	const { gamePhase, hasJoined, playerRole, isConnected } = useGameContext()

	if (!isConnected) {
		return (
			<div className='w-screen h-screen flex justify-center items-center bg-gray-600 bg-[url(/bg-vector.svg)] bg-cover bg-center'>
				<div className='text-center'>
					<p className='text-white text-2xl'>Connecting to game server...</p>
				</div>
			</div>
		)
	}

	return <AnimatePresence mode='wait'>
		{!hasJoined && <RoomEntry key="room-entry" />}
            
		{hasJoined && gamePhase === 'waiting' && <WaitingRoom key="waiting-room" />}
		
		{hasJoined && gamePhase === 'role-assignment' && <RoleReveal key="role-reveal" role={playerRole} />}
		
		{hasJoined && gamePhase === 'question' && <QuestionPhase key="question-phase" role={playerRole} />}
		
		{hasJoined && gamePhase === 'voting' && <VotingPhase key="voting-phase" />}

		
		{hasJoined && gamePhase === 'results' && <ResultsPhase key="results-phase" />}
	</AnimatePresence>
}
