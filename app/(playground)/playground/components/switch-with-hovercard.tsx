import React from "react"
import { Switch } from "@/components/ui/switch"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"

interface SwitchWithHoverCardProps {
	id: string
	label: string
	checked: boolean
	onCheckedChange: (checked: boolean) => void
	hoverContent: string
	disabled?: boolean
}

export default function SwitchWithHoverCard({
	id,
	label,
	checked,
	onCheckedChange,
	hoverContent,
	disabled = false,
}: SwitchWithHoverCardProps) {
	return (
		<HoverCard openDelay={200}>
			<HoverCardTrigger asChild>
				<div className="flex items-center space-x-2">
					<Switch
						id={id}
						checked={checked}
						onCheckedChange={onCheckedChange}
						disabled={disabled}
					/>
					<Label
						htmlFor={id}
						className={disabled ? "text-gray-400" : ""}
					>
						{label}
					</Label>
				</div>
			</HoverCardTrigger>
			<HoverCardContent
				align="start"
				className="w-[260px] text-sm"
				side="right"
			>
				{hoverContent}
			</HoverCardContent>
		</HoverCard>
	)
}
