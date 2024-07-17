"use client"
import React, { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import {
	CircleMinus,
	CirclePlus,
	Copy,
	SquareTerminal,
	Trash,
} from "lucide-react"
import Link from "next/link"

interface Model {
	id: string
	object: string
	created: number
	owned_by: string
}

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

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([
		{ role: "user", content: "" },
	])
	const [systemPrompt, setSystemPrompt] = useState("")
	const [loading, setLoading] = useState(false)
	const [models, setModels] = useState<Model[]>([])
	const [apiKey, setApiKey] = useState("")
	const [model, setModel] = useState("")
	const [streaming, setStreaming] = useState(true)
	const [temperature, setTemperature] = useState(0.7)
	const [jsonMode, setJsonMode] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [tokenUsage, setTokenUsage] = useState<TokenUsage>({
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
    })

	useEffect(() => {
        // Load API key from cache when component mounts
        const loadApiKeyFromCache = async () => {
            try {
                const cache = await caches.open('api-key-cache');
                const response = await cache.match('api-key');
                if (response) {
                    const data = await response.json();
                    setApiKey(data.apiKey);
                }
            } catch (error) {
                console.error('Error loading API key from cache:', error);
            }
        };

        loadApiKeyFromCache();
    }, []);

    useEffect(() => {
        // Save API key to cache whenever it changes
        const saveApiKeyToCache = async () => {
            try {
                const cache = await caches.open('api-key-cache');
                await cache.put('api-key', new Response(JSON.stringify({ apiKey })));
            } catch (error) {
                console.error('Error saving API key to cache:', error);
            }
        };

        if (apiKey) {
            saveApiKeyToCache();
        }
    }, [apiKey]);

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
			setModels(data.data)
			if (data.data.length > 0) {
				setModel(data.data[0].id)
			}
		} catch (error) {
			console.error("Error fetching models:", error)
			setError(`Failed to fetch models: ${error}`)
		}
	}, [apiKey])

	useEffect(() => {
		fetchModels()
	}, [apiKey, fetchModels]) // Fetch models when API key changes

	

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
        setMessages(prevMessages => {
            const newMessages = [...prevMessages]
            if (field === 'content') {
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

	const handleStreamingChange = (checked: boolean) => {
		setStreaming(checked)
		if (checked) {
			setJsonMode(false)
		}
	}

	const handleJsonModeChange = (checked: boolean) => {
		setJsonMode(checked)
		if (checked) {
			setStreaming(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!apiKey) {
            setMessages(prevMessages => [
                ...prevMessages,
                { role: "assistant", content: "Please enter an API key to send messages." }
            ])
            return
        }
        setLoading(true)
        
        const allMessages = [
            { role: "system", content: systemPrompt },
            ...messages
        ]

        try {
            const res = await fetch(
                "http://localhost:5000/v1/chat/completions",
                {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        messages: allMessages,
                        model,
                        stream: streaming,
                        temperature,
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
                                const content = parsedJson.choices[0].delta.content || ""
                                assistantResponse += content

                                setMessages(prevMessages => {
                                    const newMessages = [...prevMessages]
                                    if (newMessages[newMessages.length - 1].role === "assistant") {
                                        newMessages[newMessages.length - 1].content = assistantResponse
                                    } else {
                                        newMessages.push({ role: "assistant", content: assistantResponse })
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
                setMessages(prevMessages => [
                    ...prevMessages,
                    { role: "assistant", content: data.choices[0].message.content }
                ])
                setTokenUsage(data.usage)
            }
        } catch (error) {
            console.error("Error:", error)
            setMessages(prevMessages => [
                ...prevMessages,
                { role: "assistant", content: `An error occurred: ${error}` }
            ])
        }
        setLoading(false)
    }

	const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(e.target.value);
    };

    const renderMessage = (message: Message, index: number) => {
        let content = message.content;
        if (jsonMode && message.role === "assistant") {
            try {
                const parsedJson = JSON.parse(content);
                content = JSON.stringify(parsedJson, null, 2);
            } catch (error) {
                console.error("Failed to parse JSON:", error);
            }
        }
	}

	return (
		<div className="flex flex-row min-h-screen">
			<div className="flex flex-col p-2 pt-6 h-full">
				<Link className="flex flex-row gap-x-2" href={"/"}>
					<SquareTerminal />
					<span>Playground</span>
				</Link>
			</div>
			<div className="flex flex-col w-full p-12 h-screen">
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
				<div className="flex flex-row h-full gap-x-4">
					<div className="flex flex-col pt-4 w-1/6 max-w-64">
						<h3 className="mb-2">SYSTEM</h3>
						<Textarea
							className="resize-none h-full rounded-none p-0 focus:!ring-transparent border-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
							placeholder="Enter system message"
							value={systemPrompt}
							onChange={(e) => setSystemPrompt(e.target.value)}
						/>
					</div>
					<div className="flex container h-full relative mx-auto w-1/2">
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
					<div className="flex flex-col w-1/4 space-y-4">
						<div className="flex flex-col">
							<h3 className="mb-2">API Key:</h3>
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
								className="self-end"
								onClick={generateApiKey}
							>
								Generate New API Key
							</Button>
						</div>
						<div>
							<h3 className="mb-2">Model:</h3>
							<Select value={model} onValueChange={setModel}>
								<SelectTrigger>
									<SelectValue placeholder="Select model" />
								</SelectTrigger>
								<SelectContent>
									{models.map((m) => (
										<SelectItem key={m.id} value={m.id}>
											{m.id}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex flex-row justify-between">
								<h3 className="mb-2 self-end">Temperature:</h3>
								<Input
									type="number"
									min="0"
									max="1"
									step="0.1"
									value={temperature}
									onChange={(e) =>
										setTemperature(Number(e.target.value))
									}
									className="w-20"
								/>
							</div>
							<Slider
								min={0}
								max={1}
								step={0.1}
								value={[temperature]}
								onValueChange={(value) =>
									setTemperature(value[0])
								}
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="streaming"
								checked={streaming}
								onCheckedChange={handleStreamingChange}
							/>
							<label htmlFor="streaming">Stream</label>
						</div>
						<div className="flex items-center space-x-2">
							<Switch
								id="jsonMode"
								checked={jsonMode}
								onCheckedChange={handleJsonModeChange}
							/>
							<label htmlFor="jsonMode">JSON Mode</label>
						</div>
						<div className="space-y-2">
                            <h2 className="">Token Usage:</h2>
                            <div className="text-sm px-4">
                                <div>Prompt Tokens: {tokenUsage.prompt_tokens}</div>
                                <div>Completion Tokens: {tokenUsage.completion_tokens}</div>
                                <div>Total Tokens: {tokenUsage.total_tokens}</div>
                            </div>
                        </div>
					</div>
				</div>
			</div>
		</div>
	)
}
