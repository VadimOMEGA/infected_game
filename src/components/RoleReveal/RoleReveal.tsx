'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { getRandomGameSet } from '@/constants/gameSets'

import type { Role } from '@/types/game'
import { useGameContext } from '@/providers/GameProvider'
import FlipCard from '../ui/FlipCard'

interface IRoleRevealProps {
	role: Role | null
}

const RoleReveal = ({ role }: IRoleRevealProps) => {

    const { gameSet, startQuestions } = useGameContext()
    const [isShowingGameSet, setIsShowingGameSet] = useState(true)
    const [timer, setTimer] = useState(15)

    useEffect(() => {
        if (!isShowingGameSet) return

        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 0) {
                    // Timer finished, show role
                    setIsShowingGameSet(false)
                    clearInterval(interval)

                    setTimeout(() => {
                        startQuestions()
                    }, 7000)
                    return 0
                }
                return prev - 1
            })
        }, 1000) // Update every second

        return () => clearInterval(interval)
    }, [isShowingGameSet])

    const formatTimer = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const isInfected = role === 'INFECTED'

	return (
		<motion.div
			className='w-screen h-screen overflow-hidden bg-[url(/bg-vector.svg)] bg-cover bg-center'
			initial={{
				backgroundColor: '#1868D5'
			}}
			animate={{
				backgroundColor: '#1FB254'
			}}
		>
            <AnimatePresence mode='wait'>
            {
                isShowingGameSet ? (
                    <div key="game-set" className='w-screen h-screen flex justify-center items-center flex-col px-1.5'>
                        <motion.p 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className='text-white/50 text-[3.25rem] font-[600] text-center'>{formatTimer(timer)}</motion.p>
                        <motion.h1 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className='mt-2 md:text-[3.5rem] text-[2rem] font-[600] text-center text-white'>What's the game setting?</motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className='text-base font-[400] text-center mt-0.5 text-white'>Read carefully what is the scenery and act in a proper way.</motion.p>
                        <motion.h2 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className='text-black md:text-[3.5rem] text-[2rem] font-[600] text-center max-w-[68rem] w-full mt-6'>{ gameSet }</motion.h2>
                    </div>
                ) : (
                    <div className='w-screen h-screen flex justify-center items-center'>
                        <FlipCard 
                            isInfected={isInfected}
                            autoFlip={true}
                            autoFlipDelay={5000}
                            isInitiallyFlipped={false}
                            addQuestionCard={true}
                        />
                    </div>
                )
            }
            </AnimatePresence>

        </motion.div>
	)
}

export default RoleReveal
