import React from "react"
import { Card } from "@/components/ui/card"
import CodeBlock from "@/components/custom/CodeBlock"

const ApiReference = () => {
	return (
		<div className="min-h-screen mx-auto p-8 w-full md:w-2/3 lg:w-1/2 text-neutral-700">
			<h1 className="text-3xl text-neutral-900 font-bold mb-6">
				API Reference
			</h1>

			<section className="mb-8">
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					Chat Completions
				</h2>
				<Card className="bg-neutral-100 p-4 mb-4 rounded-md">
					<h3 className="text-xl font-semibold mb-2 bg-green-200 w-fit">
						POST /v1/chat/completions
					</h3>
					<p className="mb-2">
						Create a chat completion for the provided prompt and
						parameters.
					</p>
					<h4 className="font-semibold mb-1">Request Body:</h4>
					<CodeBlock
						code={`{
  "model": "llama2",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello, how are you?"}
  ],
  "temperature": 0.7,
  "stream": false,
  "response_format": {"type": "text"}
}`}
						language="json"
					/>

					<h4 className="font-semibold mb-1">Response:</h4>
					<CodeBlock
						code={`{
  "id": "chatcmpl-123abc",
  "object": "chat.completion",
  "created": 1677858242,
  "model": "llama2",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! As an AI assistant, I don't have feelings, but I'm functioning well and ready to help you. How can I assist you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 23,
    "completion_tokens": 28,
    "total_tokens": 51
  }
}`}
						language="json"
					/>
				</Card>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					Models
				</h2>
				<Card className="bg-neutral-100 p-4 mb-4 rounded-md">
					<h3 className="text-xl font-semibold mb-2 bg-green-200 w-fit">
						GET /v1/models
					</h3>
					<p className="mb-2">
						List the currently available models, and provide basic
						information about each one.
					</p>
					<h4 className="font-semibold mb-1">Response:</h4>
					<CodeBlock
						code={`{
  "object": "list",
  "data": [
    {
      "id": "llama2",
      "object": "model",
      "created": 1677610602,
      "owned_by": "openai",
      "permission": [],
      "root": "llama2",
      "parent": null
    },
    {
      "id": "gpt-3.5-turbo",
      "object": "model",
      "created": 1677610602,
      "owned_by": "openai",
      "permission": [],
      "root": "gpt-3.5-turbo",
      "parent": null
    }
  ]
}`}
						language="json"
					/>
				</Card>
			</section>

			<section>
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					API Keys
				</h2>
				<Card className="bg-neutral-100 p-4 mb-4 rounded-md">
					<h3 className="text-xl font-semibold mb-2 bg-green-200 w-fit">
						POST /v1/api_keys
					</h3>
					<p className="mb-2">Create a new API key.</p>
					<h4 className="font-semibold mb-1">Response:</h4>
					<CodeBlock
						code={`{
  "api_key": "sk-1234567890abcdef1234567890abcdef"
}`}
						language="json"
					/>
				</Card>
			</section>
		</div>
	)
}

export default ApiReference
