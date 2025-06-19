'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/cnUtility'

interface FlipCardProps {
	autoFlip?: boolean
	autoFlipDelay?: number
	isInfected?: boolean
	isInitiallyFlipped?: boolean
	addQuestionCard? : boolean
	className?: string
}

const FlipCard = ({ autoFlip, autoFlipDelay, isInfected, isInitiallyFlipped, addQuestionCard, className }: FlipCardProps) => {
	const [isFlipped, setIsFlipped] = useState(isInitiallyFlipped)

	// ✅ Motion values for tilt effect
	const x = useMotionValue(0)
	const y = useMotionValue(0)

	// ✅ Spring animations for smooth tilt
	const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [3, -3]))
	const tiltY = useSpring(useTransform(x, [-0.5, 0.5], [-3, 3]))

	const flipRotation = useMotionValue(isInitiallyFlipped ? 180 : 0)
    const flipSpring = useSpring(flipRotation, {
        stiffness: 150,
        damping: 25
    })

	useEffect(() => {
		if (autoFlip) {
			const timer = setTimeout(() => {
				setIsFlipped(true)
			}, autoFlipDelay)

			return () => clearTimeout(timer)
		}
	}, [autoFlip, autoFlipDelay])

	useEffect(() => {
		flipRotation.set(isFlipped ? 180 : 0)
	}, [isFlipped, flipRotation])

	const handleFlip = () => {
		if (autoFlip) return
		setIsFlipped(!isFlipped)
	}

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		const rect = event.currentTarget.getBoundingClientRect()
		const width = rect.width
		const height = rect.height
		const mouseX = event.clientX - rect.left
		const mouseY = event.clientY - rect.top

		const xPct = mouseX / width - 0.5
		const yPct = mouseY / height - 0.5

		x.set(xPct)
		y.set(yPct)
	}

	const handleMouseLeave = () => {
		x.set(0)
		y.set(0)
	}

	const combinedRotateY = useTransform(
		[tiltY, flipSpring],
		(values: number[]) => values[0] + values[1]
	)

	return (
		<motion.div
			initial={isInitiallyFlipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5, duration: 0.5 }}
			className={cn(
                'relative cursor-pointer perspective-distant',
                !className && 'sm:w-[26.25rem] sm:h-[32rem] h-[26rem] w-[21.375rem]',
                className
            )}
			onClick={handleFlip}
		>
			<motion.div
				className='relative w-full h-full'
				style={{
					transformStyle: 'preserve-3d',
					rotateX: rotateX,
					rotateY: combinedRotateY
				}}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				{ addQuestionCard && (
					<motion.div
						className={`absolute inset-0 w-full translate-z-[5px] z-10 h-full backface-hidden md:rounded-[2rem] rounded-[0.75rem] overflow-hidden shadow-2xl bg-center bg-cover`}
						style={{ backgroundImage: 'url(/question-card.svg)' }}
						initial={{ y: 0, rotateX: 0 }}
						animate={{ y: "-100vh", rotateX: 40 }}
						transition={{ 
							y: { type: 'spring', stiffness: 50, damping: 20, delay: 2 }, 
							rotateX: { type: 'spring', stiffness: 50, damping: 20, delay: 3 }
						}}
					/>
				)}
				<div
					className={`absolute inset-0 w-full translate-z-[4px] h-full backface-hidden md:rounded-[2rem] rounded-[0.75rem] overflow-hidden shadow-2xl bg-center bg-cover`}
					style={{ backgroundImage: isInfected ? 'url(/infected.svg)' : 'url(/healthy.svg)' }}
				/>

				<div
					className='absolute inset-0 w-full h-full md:rounded-[2rem] rounded-[0.75rem] bg-gradient-to-r from-gray-100 to-gray-200'
					style={{ transform: 'translateZ(3px)' }}
				/>
				<div
					className='absolute inset-0 w-full h-full md:rounded-[2rem] rounded-[0.75rem] bg-gradient-to-r from-gray-100 to-gray-200'
					style={{ transform: 'translateZ(2px)' }}
				/>
				<div
					className='absolute inset-0 w-full h-full md:rounded-[2rem] rounded-[0.75rem] bg-gradient-to-r from-gray-200 to-gray-300'
					style={{ transform: 'translateZ(1px)' }}
				/>
				<div
					className='absolute inset-0 w-full h-full md:rounded-[2rem] rounded-[0.75rem] bg-gradient-to-r from-gray-200 to-gray-300'
					style={{ transform: 'translateZ(0px)' }}
				/>

				<div
					className='absolute inset-0 w-full h-full backface-hidden md:rounded-[2rem] rounded-[0.75rem] overflow-hidden shadow-2xl bg-center bg-cover'
					style={{ transform: 'rotateY(180deg)', backgroundImage: 'url(/backface.svg)' }}
				/>
			</motion.div>
		</motion.div>
	)
}

export default FlipCard
