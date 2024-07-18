"use client"
import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { FileText, FlaskConical, ChevronDown, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

interface NavLinkProps {
	href: string
	icon: LucideIcon
	children: React.ReactNode
}

interface SubMenuProps {
	title: string
	items: { href: string; label: string }[]
	isOpen: boolean
	toggleOpen: () => void
	baseHref: string
}

export default function PlaygroundLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const [isDocumentationOpen, setIsDocumentationOpen] = useState(false)

	useEffect(() => {
		// Open submenu if on a documentation page
		if (pathname.startsWith("/documentation")) {
			setIsDocumentationOpen(true)
		} else {
			// Close submenu if not on a documentation page
			setIsDocumentationOpen(false)
		}
	}, [pathname])

	const NavLink: React.FC<NavLinkProps> = ({
		href,
		icon: Icon,
		children,
	}) => {
		const isActive = pathname === href
		return (
			<Link
				className={`flex flex-row items-center gap-x-2 p-2 border-neutral-300 border-b transition-colors pr-12 ${
					isActive ? "bg-neutral-100" : ""
				}`}
				href={href}
			>
				<Icon className="w-5 h-5" />
				<span>{children}</span>
			</Link>
		)
	}

	const SubMenu: React.FC<SubMenuProps> = ({
		title,
		items,
		isOpen,
		toggleOpen,
		baseHref,
	}) => {
		const isActive = pathname.startsWith(baseHref)
		return (
			<div>
				<Link
					href={baseHref}
					className={`flex flex-row items-center gap-x-2 p-2 border-neutral-300 border-b transition-colors pr-12 w-full ${
						isActive && pathname === baseHref
							? "bg-neutral-100"
							: ""
					}`}
					onClick={(e) => {
						if (isActive) {
							toggleOpen()
						}
					}}
				>
					<FileText className="w-5 h-5" />
					<span>{title}</span>
					{isOpen ? (
						<ChevronDown className="w-4 h-4 ml-auto" />
					) : (
						<ChevronRight className="w-4 h-4 ml-auto" />
					)}
				</Link>
				{isOpen && (
					<div className="">
						{items.map((item, index) => (
							<Link
								key={index}
								href={item.href}
								className={`block p-2 transition-colors text-sm border-neutral-300 border-b ml-3 ${
									pathname === item.href
										? "bg-neutral-100"
										: ""
								}`}
							>
								<span className="">{item.label}</span>
							</Link>
						))}
					</div>
				)}
			</div>
		)
	}

	return (
		<div className="flex flex-row min-h-screen h-full">
			<Card className="flex flex-col rounded-none p-2 pt-6 space-y-1 min-h-full ">
				<NavLink href="/playground" icon={FlaskConical}>
					Playground
				</NavLink>
				<SubMenu
					title="Documentation"
					items={[
						{
							href: "/documentation/getting-started",
							label: "Getting Started",
						},
						{
							href: "/documentation/api-reference",
							label: "API Reference",
						},
						{ href: "/documentation/examples", label: "Examples" },
					]}
					isOpen={isDocumentationOpen}
					toggleOpen={() =>
						setIsDocumentationOpen(!isDocumentationOpen)
					}
					baseHref="/documentation"
				/>
			</Card>
			<div className="flex flex-col w-full p-4 h-screen overflow-y-scroll">
				{children}
			</div>
		</div>
	)
}
