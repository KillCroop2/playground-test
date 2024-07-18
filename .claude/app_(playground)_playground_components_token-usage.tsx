import React from "react"
import { Hash, DollarSign, Zap } from "lucide-react"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"

interface TokenUsageProps {
	promptTokens: number
	completionTokens: number
	model: string
}

const modelPricing: { [key: string]: { prompt: number; completion: number } } =
	{
		"llama3:latest": { prompt: 0.0015, completion: 0.002 },
		"gemma:7b": { prompt: 0.03, completion: 0.06 },
		// Add more models and their pricing here
	}

export const TokenUsage: React.FC<TokenUsageProps> = ({
	promptTokens,
	completionTokens,
	model,
}) => {
	const totalTokens = promptTokens + completionTokens

	const pricing = modelPricing[model] || { prompt: 0, completion: 0 }
	const estimatedCost = (
		(promptTokens * pricing.prompt +
			completionTokens * pricing.completion) /
		1000
	).toFixed(4)

	return (
		<div className="grid gap-2">
			<HoverCard openDelay={200}>
				<HoverCardTrigger asChild>
					<Label htmlFor="token_usage">Token Usage</Label>
				</HoverCardTrigger>
				<HoverCardContent
					align="start"
					className="w-[260px] text-sm"
					side="left"
				>
					Tokens are used to measure the price of the API costs.
				</HoverCardContent>
			</HoverCard>
			<div className="grid grid-cols-2 gap-4">
				<div className="flex items-center">
					<HoverCard openDelay={200}>
						<HoverCardTrigger asChild>
							<div>
								<Label
									className=" text-sm"
									htmlFor="prompt_tokens"
								>
									Prompt Tokens
								</Label>
								<p className="text-sm text-gray-600">
									{promptTokens}
								</p>
							</div>
						</HoverCardTrigger>
						<HoverCardContent
							align="start"
							className="w-[260px] text-sm"
							side="left"
						>
							The tokens that sent to the API from your previous
							message history, or system prompt.
						</HoverCardContent>
					</HoverCard>
				</div>
				<div className="flex items-center">
					<HoverCard openDelay={200}>
						<HoverCardTrigger asChild>
							<div>
								<Label
									className=" text-sm"
									htmlFor="completion_tokens"
								>
									Completion Tokens
								</Label>
								<p className="text-sm text-gray-600">
									{completionTokens}
								</p>
							</div>
						</HoverCardTrigger>
						<HoverCardContent
							align="start"
							className="w-[260px] text-sm"
							side="left"
						>
							The tokens that sent from the LLM to the client.
						</HoverCardContent>
					</HoverCard>
				</div>
				<div className="flex items-center">
					<HoverCard openDelay={200}>
						<HoverCardTrigger asChild>
							<div>
								<Label
									className=" text-sm"
									htmlFor="total_tokens"
								>
									Total Tokens
								</Label>
								<p className="text-sm text-gray-600">
									{totalTokens}
								</p>
							</div>
						</HoverCardTrigger>
						<HoverCardContent
							align="start"
							className="w-[260px] text-sm"
							side="left"
						>
							Total tokens used in the API response.
						</HoverCardContent>
					</HoverCard>
				</div>
				<div className="flex items-center">
					<HoverCard openDelay={200}>
						<HoverCardTrigger asChild>
							<div>
								<Label className=" text-sm" htmlFor="est_cost">
									Estimated Cost
								</Label>
								<p className="text-sm text-gray-600">
									${estimatedCost}
								</p>
							</div>
						</HoverCardTrigger>
						<HoverCardContent
							align="start"
							className="w-[260px] text-sm"
							side="left"
						>
							The estimated cost of your model usage
						</HoverCardContent>
					</HoverCard>
				</div>
			</div>
			<p className="text-xs text-gray-500 mt-3">
				*Cost estimation based on current pricing for {model}. Actual
				cost may vary.
			</p>
		</div>
	)
}
