import { motion } from 'motion/react'
import React from 'react'

import { useGameContext } from '@/providers/GameProvider'

import { GAME_CONFIG } from '@/config/gameConfig'
import Button from '../ui/Button'

const WaitingRoom = () => {
	const { players, gameInfo, setReady, getCurrentPlayer, isPlayerReady, isConnected } =
		useGameContext()

	const playersCount = players.length

	const currentPlayer = getCurrentPlayer()
	const playerReady = isPlayerReady()

	const handleReadyToggle = () => {
		setReady(!playerReady)
	}

	return (
		<motion.div 
			className='w-screen min-h-screen overflow-x-hidden md:overflow-y-hidden bg-[url(/bg-vector.svg)] bg-cover bg-center'
			initial={{
				backgroundColor: '#FF643B'
			}}
			animate={{
				backgroundColor: '#1868D5'
			}}
		>
			<motion.div
				className='w-screen min-h-screen relative flex justify-center items-center text-white pt-8.25 pb-6'
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
				<div className='flex flex-col justify-center items-center px-1.5'>
					<p className=' md:text-[3.5rem] text-[2rem] font-[600] text-center'>Waiting for everyone to join</p>
					<p className='text-base max-w-40 w-full font-[400] text-center mt-1.5'>
						Let's wait till everyone joins and gets ready. Or maybe you are wasting time and not
						pressing the “Ready?” button.
					</p>

					<Button 
                        text={playerReady ? 'Cancel Ready' : 'Ready to Play'}
                        onClick={handleReadyToggle}
                        disabled={!isConnected}
						className='md:hidden mt-3'
                    />

					<div className='grid md:gap-10 gap-4 xl:grid-cols-4 md:grid-cols-2 grid-cols-1 md:mt-6 mt-4.5 items-center'>
						{players.map(player => (
							<div
								key={player.id}
								className='relative flex flex-col items-center justify-center gap-[1.25rem]'
							>
                                {player.id === currentPlayer?.id && (
                                    <span className='absolute top-[-0.5rem] -translate-y-[100%] text-base font-[400]'>(You)</span>
                                )}
								<p className='text-[2rem] font-[500] text-center leading-[0.7]'>{player.nickname}</p>
								<div className='font-[400] px-1 py-0.5 rounded-[2rem] bg-black text-base'>{player.ready ? 'Ready' : 'Not Ready'}</div>
							</div>
						))}
						{Array.from({ length: GAME_CONFIG.MAX_PLAYERS - playersCount }).map((_, index) => (
							<div
								key={ index }
								className='relative flex flex-col items-center justify-center gap-[1.25rem]'
							>
								<p className='text-[2rem] font-[500] text-center leading-[0.7]'>no player :/</p>
								<div className='font-[400] px-1 py-0.5 rounded-[2rem] bg-black text-base'>Empty</div>
							</div>
						))}
					</div>

                    <Button 
                        text={playerReady ? 'Cancel Ready' : 'Ready to Play'}
                        onClick={handleReadyToggle}
                        disabled={!isConnected}
						className='max-md:hidden'
                    />
				</div>
			</motion.div>
		</motion.div>
	)
}

export default WaitingRoom
