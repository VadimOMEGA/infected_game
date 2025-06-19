'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { useGameContext } from '@/providers/GameProvider'

import { GAME_CONFIG } from '@/config/gameConfig'

import Button from '../ui/Button'
import FlipCard from '../ui/FlipCard'

import type { Role } from '@/types/game'

interface IRoleRevealProps {
	role: Role | null
}

const QuestionPhase = ({ role }: IRoleRevealProps) => {
	const isInfected = role === 'INFECTED'
	const [showQuestion, setShowQuestion] = useState(false)
  const [color, setColor] = useState<'#FFBB25' | '#FF643B' | '#1868D5' | '#1FB254'>('#FFBB25')

	const { questionNumber, currentQuestion, questionReadyStatus, setQuestionReady } =
		useGameContext()

	const [isPlayerReady, setIsPlayerReady] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowQuestion(true)
		}, 50)

		return () => clearTimeout(timer)
	}, [])

	const handleNextQuestion = () => {
		if (!isPlayerReady) {
        setIsPlayerReady(true)
        setQuestionReady()
    }
	}

	useEffect(() => {
		setIsPlayerReady(false)
	}, [questionNumber])

  const getButtonText = () => {
      if (questionReadyStatus.allReady) {
          return 'Starting next...'
      }
      return isPlayerReady ? 'Ready' : 'Ready for next'
  }

  useEffect(() => {
    if (questionNumber === 1) {
      setColor('#FFBB25')
    } else if (questionNumber === 2) {
      setColor('#FF643B')
    } else if (questionNumber === 3) {
      setColor('#1868D5')
    } else if (questionNumber >= GAME_CONFIG.QUESTIONS_COUNT) {
      setColor('#1FB254')
    }
  }, [questionNumber])

	return (
		<motion.div
			className='w-screen min-h-screen overflow-x-hidden bg-[url(/bg-vector.svg)] bg-cover bg-center'
			initial={{
				backgroundColor: '#1FB254'
			}}
			animate={{
				backgroundColor: color
			}}
		>
			{!showQuestion && (
				<div className='w-screen min-h-screen flex items-center justify-center pt-2 pb-6'>
					<motion.div
						layoutId='game-card'
						transition={{
							type: 'spring',
							stiffness: 100,
							damping: 25,
							duration: 1.2
						}}
					>
						<FlipCard
							isInfected={isInfected}
							autoFlip={false}
							isInitiallyFlipped={true}
						/>
					</motion.div>
				</div>
			)}

			{showQuestion && (
				<div className='w-screen min-h-screen flex lg:flex-row flex-col-reverse items-center justify-center lg:gap-[8.5rem] gap-6 px-1.5 pt-2 pb-6'>
					<motion.div
						layoutId='game-card'
						transition={{
							type: 'spring',
							stiffness: 100,
							damping: 25,
							duration: 0.7
						}}
					>
						<FlipCard
							isInfected={isInfected}
							autoFlip={false}
							isInitiallyFlipped={true}
						/>
					</motion.div>

					{/* ✅ Question content appears */}
					<div className='flex flex-col items-center justify-center max-w-[46.25rem] w-full'>
						<motion.p
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className='md:text-[3.25rem] text-[2rem] font-[600] text-white/50'
						>
							{questionNumber ? `0${questionNumber}` : '01'}
						</motion.p>

						<motion.h1
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.5 }}
							className='md:text-[3.25rem] text-[2rem] text-white font-[600] mt-2 text-center'
						>
							{currentQuestion || 'Loading question...'}
						</motion.h1>

						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5, duration: 0.5 }}
							className='w-full flex justify-center'
						>
							<Button
								text={getButtonText()}
								onClick={handleNextQuestion}
								disabled={questionReadyStatus.allReady}
								className='max-lg:mt-3'
							/>
						</motion.div>

						{/* ✅ Show ready status */}
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6, duration: 0.5 }}
							className='mt-1.5 text-center'
						>
							<p className='text-white px-1 py-0.5 bg-black rounded-[2rem] text-base'>
								{questionReadyStatus.readyCount}/{questionReadyStatus.totalPlayers}
							</p>
						</motion.div>
					</div>
				</div>
			)}
		</motion.div>
	)
}

export default QuestionPhase
