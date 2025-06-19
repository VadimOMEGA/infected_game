'use client'

import { motion } from 'motion/react'
import { useState } from 'react'

import { useGameContext } from '@/providers/GameProvider'
import Button from '../ui/Button'

const RoomEntry = () => {
	const { joinRoom, joinError, isConnected, isJoining } = useGameContext()
	const [roomKey, setRoomKey] = useState('')
	const [nickname, setNickname] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!roomKey.trim() || !nickname.trim()) {
			return
		}

		joinRoom(nickname.trim(), roomKey.trim().toUpperCase())
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && roomKey.trim() && nickname.trim()) {
			handleSubmit(e as any)
		}
	}

	return (
		<motion.div 
			className='w-full min-h-screen overflow-x-hidden md:overflow-y-hidden bg-orange bg-[url(/bg-vector.svg)] bg-cover bg-center'
			initial={{
				backgroundColor: '#4a5565'
			}}
			animate={{
				backgroundColor: '#FF643B'
			}}
		>
			<motion.div
				className='w-full min-h-screen relative flex justify-center items-center text-white'
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
                    damping: 25,
				}}
				style={{
					perspective: 1200,
					transformStyle: 'preserve-3d'
				}}
			>
				<p className='text-base absolute md:left-4 left-1/2 max-md:-translate-x-1/2 top-3 font-[400]'>
					One of us is <span className='font-[700]'>Infected</span>
				</p>

				<form 
                    className='flex flex-col justify-center items-center w-full px-1.5'
                    onSubmit={handleSubmit}
                >
					<p className='md:text-[3.5rem] text-[2rem] font-[600] text-center'>Enter the room code</p>
					<input
						type='text'
						className='md:max-w-[26.5rem] max-w-full border-2 border-white outline-none text-center h-3.25 w-full mt-1.5 rounded-3xl text-base placeholder:text-white'
						placeholder='Do you have the code (e.g. GAME2025)?'
                        value={roomKey}
						onChange={e => setRoomKey(e.target.value.toUpperCase())}
						onKeyDown={handleKeyPress}
                        disabled={isJoining || !isConnected}
						maxLength={20}
                        autoComplete='off'
					/>

					<p className='md:text-[3.5rem] text-[2rem] text-center font-[600]  mt-6'>Choose a nickname</p>
					<input
						type='text'
						className='md:max-w-[26.5rem] max-w-full border-2 border-white outline-none text-center h-3.25 w-full mt-1.5 rounded-3xl text-base placeholder:text-white'
						placeholder='What do your friends call you?'
                        value={nickname}
						onChange={e => setNickname(e.target.value)}
						onKeyDown={handleKeyPress}
                        disabled={isJoining || !isConnected}
						maxLength={20}
						autoComplete='off'
					/>

                    <Button 
                        text={isJoining ? "Joining..." : 'Ready? Enter room'}
                        type='submit'
                    />

                    {joinError && (
                        <motion.p 
                            className='text-white text-base'
                            initial={{ 
                                opacity: 0,
                                y: -20,
                                marginTop: '0rem'
                            }}
                            animate={{ 
                                opacity: 1,
                                y: 0,
                                marginTop: '2rem'
                            }}
                        >
                            *{joinError}
                        </motion.p>
                    )}
				</form>

				<div className='absolute bottom-3 w-full flex sm:flex-row flex-col justify-between items-center px-4'>
					<p className='text-base font-[400]'>desgined Țurcanu Cătălin</p>
					<p className='text-base font-[400]'>developed Studio Modvis</p>
				</div>
			</motion.div>
		</motion.div>
	)
}

export default RoomEntry
