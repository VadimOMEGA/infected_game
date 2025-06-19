import type { Metadata } from 'next'

import { GameProvider } from '@/providers/GameProvider'

import './globals.css'

export const metadata: Metadata = {
	title: 'One of us is Infected'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body>
				<GameProvider>{children}</GameProvider>
			</body>
		</html>
	)
}
