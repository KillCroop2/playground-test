import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { PopoverProps } from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"

export interface Model {
	id: string
	name: string
	description: string
	strengths?: string
	owned_by: string
	price: {
		prompt: number
		completion: number
	}
}

interface ModelSelectorProps extends PopoverProps {
	models: Model[]
	selectedModel: Model | null
	onModelSelect: (model: Model) => void
}

// Helper function to safely convert price to number and format it
const formatPrice = (price: string | number): string => {
	const numPrice = typeof price === "string" ? parseFloat(price) : price
	return isNaN(numPrice) ? "N/A" : numPrice.toFixed(4)
}

export function ModelSelector({
	models,
	selectedModel,
	onModelSelect,
	...props
}: ModelSelectorProps) {
	const [open, setOpen] = React.useState(false)
	const [peekedModel, setPeekedModel] = React.useState<Model | null>(null)

	React.useEffect(() => {
		if (!selectedModel && models.length > 0) {
			onModelSelect(models[0])
		}
	}, [selectedModel, models, onModelSelect])

	const handleSelectModel = React.useCallback(
		(modelId: string) => {
			const model = models.find((m) => m.id === modelId)
			if (model) {
				onModelSelect(model)
				setOpen(false)
			}
		},
		[models, onModelSelect]
	)

	const displayedModel = peekedModel || selectedModel || models[0]

	// Group models by owned_by
	const groupedModels = React.useMemo(() => {
		return models.reduce((acc, model) => {
			const category = model.owned_by || "Other"
			if (!acc[category]) {
				acc[category] = []
			}
			acc[category].push(model)
			return acc
		}, {} as Record<string, Model[]>)
	}, [models])

	return (
		<div className="grid gap-2">
			<HoverCard openDelay={200}>
				<HoverCardTrigger asChild>
					<Label htmlFor="model">Model</Label>
				</HoverCardTrigger>
				<HoverCardContent
					align="start"
					className="w-[260px] text-sm"
					side="left"
				>
					The model which will generate the completion. Models are
					grouped by their owner.
				</HoverCardContent>
			</HoverCard>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						aria-label="Select a model"
						className="w-full justify-between"
					>
						{selectedModel
							? selectedModel.name
							: "Select a model..."}
						<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="end" className="w-[450px] p-0">
					<div className="flex">
						<div className="p-4 w-[250px] border-r">
							{displayedModel ? (
								<div className="grid gap-2">
									<h4 className="font-medium leading-none">
										{displayedModel.name}
									</h4>
									<div className="text-sm text-muted-foreground">
										{displayedModel.description}
									</div>
									{displayedModel.strengths && (
										<div className="mt-4 grid gap-2">
											<h5 className="text-sm font-medium leading-none">
												Strengths
											</h5>
											<div className="text-sm text-muted-foreground">
												{displayedModel.strengths}
											</div>
										</div>
									)}
									<div className="mt-4 grid gap-2">
										<h5 className="text-sm font-medium leading-none">
											Pricing
										</h5>
										<div className="text-sm text-muted-foreground">
											Prompt: $
											{formatPrice(
												displayedModel.price.prompt
											)}{" "}
											/ 1K tokens
											<br />
											Completion: $
											{formatPrice(
												displayedModel.price.completion
											)}{" "}
											/ 1K tokens
										</div>
									</div>
								</div>
							) : (
								<div className="text-sm text-muted-foreground">
									No model information available.
								</div>
							)}
						</div>
						<Command className="w-[200px]">
							<CommandInput placeholder="Search Models..." />
							<CommandEmpty>No Models found.</CommandEmpty>
							<CommandList>
								{Object.entries(groupedModels).map(
									([category, categoryModels]) => (
										<CommandGroup
											key={category}
											heading={category}
										>
											{categoryModels.map((model) => (
												<CommandItem
													key={model.id}
													value={model.id}
													onSelect={handleSelectModel}
													onMouseEnter={() =>
														setPeekedModel(model)
													}
													onMouseLeave={() =>
														setPeekedModel(null)
													}
													className={cn(
														"cursor-pointer",
														"aria-selected:bg-accent aria-selected:text-accent-foreground",
														"data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
													)}
												>
													<CheckIcon
														className={cn(
															"mr-2 h-4 w-4",
															selectedModel?.id ===
																model.id
																? "opacity-100"
																: "opacity-0"
														)}
													/>
													{model.name}
												</CommandItem>
											))}
										</CommandGroup>
									)
								)}
							</CommandList>
						</Command>
					</div>
				</PopoverContent>
			</Popover>
			{selectedModel && (
				<div className="mt-2 rounded-md border p-2">
					<h4 className="font-medium">{selectedModel.name}</h4>
					<p className="text-sm text-muted-foreground">
						{selectedModel.description}
					</p>
					{selectedModel.strengths && (
						<div className="mt-2">
							<h5 className="text-sm font-medium">Strengths</h5>
							<p className="text-sm text-muted-foreground">
								{selectedModel.strengths}
							</p>
						</div>
					)}
					<div className="mt-2">
						<h5 className="text-sm font-medium">Pricing</h5>
						<p className="text-sm text-muted-foreground">
							Prompt: ${formatPrice(selectedModel.price.prompt)} /
							1K tokens
							<br />
							Completion: $
							{formatPrice(selectedModel.price.completion)} / 1K
							tokens
						</p>
					</div>
				</div>
			)}
		</div>
	)
}
