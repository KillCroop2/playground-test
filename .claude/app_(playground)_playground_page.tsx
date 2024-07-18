"use client"
import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { CircleMinus, CirclePlus, Copy } from "lucide-react"
import { ModelSelector } from "./components/model-selector"
import { TemperatureSelector } from "./components/temperature-selector"
import { TopPSelector } from "./components/top-p-selector"
import { MaxLengthSelector } from "./components/maxlength-selector"
import { Switch } from "@/components/ui/switch"
import { TokenUsage } from "./components/token-usage"
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Label } from "@/components/ui/label"

export interface Model<Type = string> {
	id: string
	name: string
	description: string
	strengths?: string
	type: Type
}

export type ModelType = "GPT-3" | "Codex" // Add other types as needed

interface Message {
	role: string
	content: string
	tokens?: number
}

interface TokenUsage {
	prompt_tokens: number
	completion_tokens: number
	total_tokens: number
}

const AutoResizingTextarea: React.FC<{
	value: string
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	placeholder: string
}> = React.memo(({ value, onChange, placeholder }) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const resizeTextarea = useCallback(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto"
			textareaRef.current.style.height = `${Math.min(
				textareaRef.current.scrollHeight,
				300
			)}px`
		}
	}, [])

	useEffect(() => {
		resizeTextarea()
	}, [value, resizeTextarea])

	return (
		<Textarea
			ref={textareaRef}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className="flex-1 rounded-none p-0 pr-6 mt-1 border-0 resize-none scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 focus:!ring-transparent"
			style={{
				minHeight: "28px",
				maxHeight: "300px",
				height: "auto",
				overflowY: "auto",
			}}
		/>
	)
})

AutoResizingTextarea.displayName = "AutoResizingTextarea"

export default function Playground() {
	const [messages, setMessages] = useState<Message[]>([
		{ role: "user", content: "" },
	])
	const [systemPrompt, setSystemPrompt] = useState("")
	const [loading, setLoading] = useState(false)
	const [models, setModels] = useState<Model[]>([])
	const [selectedModel, setSelectedModel] = useState<Model | null>(null)
	const [apiKey, setApiKey] = useState("")
	const [streaming, setStreaming] = useState(true)
	const [temperature, setTemperature] = useState(0.7)
	const [topP, setTopP] = useState(1)
	const [maxLength, setMaxLength] = useState(2048)
	const [jsonMode, setJsonMode] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [tokenUsage, setTokenUsage] = useState<TokenUsage>({
		prompt_tokens: 0,
		completion_tokens: 0,
		total_tokens: 0,
	})

	useEffect(() => {
		const loadApiKeyFromCache = async () => {
			try {
				const cache = await caches.open("api-key-cache")
				const response = await cache.match("api-key")
				if (response) {
					const data = await response.json()
					setApiKey(data.apiKey)
				}
			} catch (error) {
				console.error("Error loading API key from cache:", error)
			}
		}

		loadApiKeyFromCache()
	}, [])

	useEffect(() => {
		const saveApiKeyToCache = async () => {
			try {
				const cache = await caches.open("api-key-cache")
				await cache.put(
					"api-key",
					new Response(JSON.stringify({ apiKey }))
				)
			} catch (error) {
				console.error("Error saving API key to cache:", error)
			}
		}

		if (apiKey) {
			saveApiKeyToCache()
		}
	}, [apiKey])

	const fetchModels = useCallback(async () => {
		try {
			setError(null)
			const res = await fetch("http://localhost:5000/v1/models", {
				headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
			})
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`)
			}
			const data = await res.json()
			if (data.error) {
				throw new Error(data.error.message || "Failed to fetch models")
			}
			const fetchedModels: Model[] = data.data.map((model: any) => ({
				id: model.id,
				object: model.object,
				created: model.created,
				owned_by: model.owned_by,
				name: model.id, // Assuming the name is the same as the id
				description: "Model description", // You may need to adjust this
				type: "AI Model", // You may need to adjust this
				strengths: "Reasoning",
			}))
			setModels(fetchedModels)
			if (fetchedModels.length > 0) {
				setSelectedModel(fetchedModels[0])
			}
		} catch (error) {
			console.error("Error fetching models:", error)
			setError(`Failed to fetch models: ${error}`)
		}
	}, [apiKey])

	useEffect(() => {
		fetchModels()
	}, [apiKey, fetchModels])

	const generateApiKey = async () => {
		try {
			setError(null)
			const res = await fetch("http://localhost:5000/v1/api_keys", {
				method: "POST",
			})
			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`)
			}
			const data = await res.json()
			if (data.error) {
				throw new Error(data.error || "Failed to generate API key")
			}
			setApiKey(data.api_key)
		} catch (error) {
			console.error("Error generating API key:", error)
			setError(`Failed to generate API key: ${error}`)
		}
	}

	const handleInputChange = (
		index: number,
		field: keyof Message,
		value: string
	) => {
		setMessages((prevMessages) => {
			const newMessages = [...prevMessages]
			if (field === "content") {
				newMessages[index] = { ...newMessages[index], [field]: value }
			}
			return newMessages
		})
	}

	const toggleRole = (index: number) => {
		const newMessages = [...messages]
		newMessages[index].role =
			newMessages[index].role === "user" ? "assistant" : "user"
		setMessages(newMessages)
	}

	const addMessage = () => {
		setMessages([...messages, { role: "user", content: "" }])
	}

	const removeMessage = (index: number) => {
		const newMessages = messages.filter((_, i) => i !== index)
		setMessages(newMessages)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!apiKey) {
			setMessages((prevMessages) => [
				...prevMessages,
				{
					role: "assistant",
					content: "Please enter an API key to send messages.",
				},
			])
			return
		}
		setLoading(true)

		const allMessages = [
			{ role: "system", content: systemPrompt },
			...messages,
		]

		try {
			const res = await fetch(
				"http://localhost:5000/v1/chat/completions",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${apiKey}`,
					},
					body: JSON.stringify({
						messages: allMessages,
						model: selectedModel?.id,
						stream: streaming,
						temperature,
						top_p: topP,
						max_tokens: maxLength,
						response_format: {
							type: jsonMode ? "json_object" : "text",
						},
					}),
				}
			)

			if (res.status === 401) {
				throw new Error("Invalid API key")
			}

			if (streaming) {
				const reader = res.body?.getReader()!
				const decoder = new TextDecoder()
				let buffer = ""
				let assistantResponse = ""

				while (true) {
					const { done, value } = await reader.read()
					if (done) break

					buffer += decoder.decode(value, { stream: true })
					const lines = buffer.split("\n")
					buffer = lines.pop() || ""

					for (const line of lines) {
						if (line.startsWith("data:")) {
							const jsonString = line.slice(5).trim()
							if (jsonString === "[DONE]") continue

							try {
								const parsedJson = JSON.parse(jsonString)
								const content =
									parsedJson.choices[0].delta.content || ""
								assistantResponse += content

								setMessages((prevMessages) => {
									const newMessages = [...prevMessages]
									if (
										newMessages[newMessages.length - 1]
											.role === "assistant"
									) {
										newMessages[
											newMessages.length - 1
										].content = assistantResponse
									} else {
										newMessages.push({
											role: "assistant",
											content: assistantResponse,
										})
									}
									return newMessages
								})

								setTokenUsage(parsedJson.usage)
							} catch (error) {
								console.error("Error parsing JSON:", error)
							}
						}
					}
				}
			} else {
				const data = await res.json()
				setMessages((prevMessages) => [
					...prevMessages,
					{
						role: "assistant",
						content: data.choices[0].message.content,
					},
				])
				setTokenUsage(data.usage)
			}
		} catch (error) {
			console.error("Error:", error)
			setMessages((prevMessages) => [
				...prevMessages,
				{ role: "assistant", content: `An error occurred: ${error}` },
			])
		}
		setLoading(false)
	}

	const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setApiKey(e.target.value)
	}

	return (
		<>
			<h1 className="text-2xl font-bold mb-4">Chat API Playground</h1>
			{error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					role="alert"
				>
					<strong className="font-bold">Error: </strong>
					<span className="block sm:inline">{error}</span>
				</div>
			)}
			<Card className="flex flex-row h-full gap-x-4 p-6">
				<div className="flex flex-col p-4 w-1/5">
					<h3 className="mb-2">SYSTEM</h3>
					<Textarea
						className="resize-none h-full rounded-none p-0 focus:!ring-transparent border-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
						placeholder="Enter system message"
						value={systemPrompt}
						onChange={(e) => setSystemPrompt(e.target.value)}
					/>
				</div>
				<div className="flex container h-full relative mx-auto w-3/5">
					<form
						onSubmit={handleSubmit}
						className="space-y-2 container flex-col max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-full p-4"
					>
						{messages.map((message, index) => (
							<div
								key={index}
								className="flex relative space-x-2 items-start pt-3 pb-2 border-b"
							>
								<div className="flex justify-end w-24">
									<Button
										variant={"ghost"}
										type="button"
										onClick={() => toggleRole(index)}
										size={"sm"}
										className=" h-auto p-1"
									>
										{message.role === "user"
											? "User"
											: "Assistant"}
									</Button>
								</div>
								<AutoResizingTextarea
									value={message.content}
									onChange={(e) =>
										handleInputChange(
											index,
											"content",
											e.target.value
										)
									}
									placeholder="Enter message"
								/>
								<Button
									className="absolute bottom-0 right-2 p-0"
									type="button"
									variant="link"
									onClick={() => removeMessage(index)}
								>
									<CircleMinus className="w-5 h-5" />
								</Button>
							</div>
						))}
						<div className="flex relative space-x-2 items-start pt-3 pb-2 ">
							<Button
								type="button"
								className=" hover:no-underline px-1 py-0 h-auto"
								variant={"link"}
								onClick={addMessage}
							>
								<CirclePlus className="w-5 h-5 mr-2" />
								Add Message
							</Button>
						</div>

						<Button
							type="submit"
							className="bg-emerald-500 hover:bg-emerald-600 absolute bottom-0 right-10"
							disabled={loading}
						>
							{loading ? "Sending..." : "Send"}
						</Button>
					</form>
				</div>
				<Card className="flex flex-col p-4 w-1/4 space-y-4">
					<div className="grid gap-2">
						<HoverCard openDelay={200}>
							<HoverCardTrigger asChild>
								<Label htmlFor="api_key">API Key</Label>
							</HoverCardTrigger>
							<HoverCardContent
								align="start"
								className="w-[260px] text-sm"
								side="left"
							>
								API keys are used to authenticate users and
								measure costs. In order to use our service you
								must have a valid key. You can always generate a
								new key if you need one, but make sure to save
								it in a safe place.
							</HoverCardContent>
						</HoverCard>
						<div className="relative flex">
							<Input
								className="pr-12"
								type="password"
								value={apiKey}
								onChange={handleApiKeyChange}
								placeholder="Enter your API key"
							/>
							<Button
								className="absolute self-center right-0 hover:bg-transparent"
								variant={"ghost"}
							>
								<Copy className="w-5 h-5" />
							</Button>
						</div>

						<Button
							variant={"link"}
							className=" justify-self-end h-auto py-0 px-0 mr-3"
							onClick={generateApiKey}
						>
							Generate New API Key
						</Button>
					</div>
					<ModelSelector
						models={models}
						selectedModel={selectedModel}
						onModelSelect={(model) => {
							setSelectedModel(model)
						}}
					/>
					<TemperatureSelector defaultValue={[temperature]} />
					<TopPSelector defaultValue={[topP]} />
					<MaxLengthSelector defaultValue={[maxLength]} />
					<div className="flex items-center space-x-2">
						<Switch
							id="streaming"
							checked={streaming}
							onCheckedChange={setStreaming}
						/>
						<label htmlFor="streaming">Stream</label>
					</div>
					<div className="flex items-center space-x-2">
						<Switch
							id="jsonMode"
							checked={jsonMode}
							onCheckedChange={setJsonMode}
						/>
						<label htmlFor="jsonMode">JSON Mode</label>
					</div>
					<TokenUsage
						promptTokens={tokenUsage.prompt_tokens}
						completionTokens={tokenUsage.completion_tokens}
						model={selectedModel?.id || models[0]?.id} // Adjust based on your actual model selection
					/>
				</Card>
			</Card>
		</>
	)
}
