'use state'

import { motion } from 'motion/react'
import { useState } from 'react'

import { useGameContext } from '@/providers/GameProvider'

import Button from '../ui/Button'

const VotingPhase = () => {
	const [isVotingReady, setIsVotingReady] = useState(false)
	const { votingReadyStatus, setVotingReady } = useGameContext()

	const handleVotingReady = () => {
		if (!isVotingReady) {
			setIsVotingReady(true)
			setVotingReady()
		}
	}

	const getButtonText = () => {
		if (votingReadyStatus?.allReady) {
			return 'Starting voting...'
		}
		return isVotingReady ? 'Ready' : 'Already voted?'
	}

	return (
		<motion.div
			className='w-screen h-screen overflow-hidden bg-[url(/bg-vector.svg)] bg-cover bg-center'
			initial={{
				backgroundColor: '#1FB254'
			}}
			animate={{
				backgroundColor: '#1868D5'
			}}
		>
			<motion.div
				className='w-screen h-screen relative flex justify-center items-center flex-col text-white px-1.5'
				initial={{
					y: '100%',
					rotateX: 30
				}}
				animate={{
					y: 0,
					rotateX: 0
				}}
				exit={{
					y: '-100%',
					rotateX: 30
				}}
				transition={{
					type: 'spring',
					stiffness: 150,
					damping: 25
				}}
				style={{
					perspective: 1200,
					transformStyle: 'preserve-3d'
				}}
			>
				<h1 className='md:text-[3.25rem] text-[2rem] text-white font-[600]'>Time to Vote!</h1>

				<p className='text-white mt-1.5 text-base font-[400] text-center max-w-[46.25rem] px-4'>
					Based on the answers you've heard, discuss and decide who you think is the infected
					player.
				</p>

				{/* ✅ Ready button */}
				<Button
					text={getButtonText()}
					onClick={handleVotingReady}
					disabled={votingReadyStatus?.allReady || isVotingReady}
				/>

				{/* ✅ Ready counter */}
					<p className='text-white text-base px-1 py-0.5 bg-black rounded-[2rem] text-center mt-1.5'>
						{votingReadyStatus?.readyCount || 0}/{votingReadyStatus?.totalPlayers || 4}
					</p>
			</motion.div>
		</motion.div>
	)
}

export default VotingPhase
