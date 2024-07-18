

import { Inter as FontSans } from "next/font/google"
import "@/app/globals.css"

import { cn } from "@/lib/utils"

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
})

export const metadata = {
	title: "Chat API Playground",
	description: "A playground for testing the Chat API",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				{children}
			</body>
		</html>
	)
}
