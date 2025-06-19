'use client'

import { motion } from 'motion/react'

import { useGameContext } from '@/providers/GameProvider'

import Button from '../ui/Button'
import FlipCard from '../ui/FlipCard'

const ResultsPhase = () => {
	const { playersWithRoles, playerRole } = useGameContext()

	return (
		<div className='w-screen min-h-screen overflow-x-hidden bg-[url(/bg-vector.svg)] bg-cover bg-center bg-blue grid 3xl:grid-cols-4 grid-cols-2 gap-1.5 max-lg:gap-3 place-content-center px-1.5 pt-3 pb-6'>
			{playersWithRoles.map((player, index) => (
				<motion.div
					key={player.id}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						delay: 0.3 + index * 0.2,
						duration: 0.6,
						type: 'spring',
						stiffness: 100,
						damping: 25
					}}
					className='flex flex-col items-center'
				>
					{/* ✅ Player card */}
					<FlipCard
						isInfected={player.role === 'INFECTED'}
						autoFlip={false}
						isInitiallyFlipped={true}
						className='h-[12rem] w-[10rem] lg:w-[26.25rem] lg:h-[32rem] md:h-[18rem] md:w-[15rem]'
					/>

					{/* ✅ Player info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							delay: 0.3 + index * 0.2,
							duration: 0.6,
							type: 'spring',
							stiffness: 100,
							damping: 25
						}}
						className='text-center lg:mt-3 mt-2'
					>
						<h3 className='text-white text-[2rem] font-[500]'>{player.nickname}</h3>
						<p
							className={`text-base font-[400] px-1 py-0.5 rounded-[2rem] bg-black mt-[1.25rem] text-white`}
						>
							{player.role === 'INFECTED' ? 'Infected' : 'Healthy'}
						</p>
					</motion.div>
				</motion.div>
			))}

			<motion.div 
        className='col-span-full flex justify-center'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + playersWithRoles.length * 0.2, duration: 0.6 }}
      >
				<Button
					text='Exit game room'
					onClick={() => {
						window.location.reload()
					}}
					className='mt-4.5'
				/>
			</motion.div>
		</div>
	)
}

export default ResultsPhase
