import React from "react"
import { Card } from "@/components/ui/card"
import CodeBlock from "@/components/custom/CodeBlock"

const GettingStarted = () => {
	return (
		<div className="min-h-screen mx-auto p-8 w-full md:w-2/3 lg:w-1/2 text-neutral-700">
			<h1 className="text-3xl text-neutral-900 font-bold mb-6">
				Getting Started with Our AI API
			</h1>

			<section className="mb-8">
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					Introduction
				</h2>
				<p className="mb-4">
					Welcome to our AI API! This powerful interface allows you to
					interact with state-of-the-art language models, enabling a
					wide range of natural language processing tasks. Whether
					you&apos;re building a chatbot, a content generation tool,
					or any other AI-powered application, our API provides the
					flexibility and power you need.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					Installation
				</h2>
				<p className="mb-4">
					To get started with our API, you&apos;ll need to install our
					Python client library. You can do this using pip:
				</p>
				<Card className="bg-neutral-800 p-1 mb-4 rounded-md">
					<CodeBlock
						code={`
pip install our-ai-api-client`}
						language="bash"
					/>
				</Card>
				<p className="mb-4">
					This client library provides a convenient interface to
					interact with our API, handling authentication and request
					formatting for you.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					Authentication
				</h2>
				<p className="mb-4">
					Our API uses API keys for authentication. This ensures that
					only authorized users can access the API and allows us to
					track usage for billing purposes.
				</p>
				<p className="mb-4">
					To create an API key, send a POST request to the
					/v1/api_keys endpoint:
				</p>
				<Card className="bg-neutral-800 p-1 mb-4 rounded-md">
					<CodeBlock
						code={`
import requests

url = "http://localhost:5000/v1/api_keys"
response = requests.post(url)
api_key = response.json()["api_key"]
print(f"Your new API key is: {api_key}")
          `}
					/>
				</Card>
				<p className="mb-4">
					Once you have your API key, include it in the Authorization
					header of your requests:
				</p>
				<Card className="bg-neutral-800 p-1 mb-4 rounded-md">
					<CodeBlock
						code={"Authorization: Bearer YOUR_API_KEY"}
						language="http"
					/>
				</Card>
				<p className="mb-4">
					Always keep your API key secure and never share it publicly.
					If you believe your key has been compromised, you can
					generate a new one using the same method as above.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					Making Your First Request
				</h2>
				<p className="mb-4">
					Let&apos;s start with a simple example: generating a chat
					completion. This is useful for creating conversational AI,
					Q&A systems, or any application that requires back-and-forth
					dialogue.
				</p>
				<Card className="bg-neutral-800 p-1 mb-4 rounded-md">
					<CodeBlock
						code={`
import requests

url = "http://localhost:5000/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "model": "llama2",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result["choices"][0]["message"]["content"])
          `}
					/>
				</Card>
				<p className="mb-4">
					This script sends a request to generate a response to the
					question &quot;What is the capital of France?&quot;. The
					system message sets the context for the AI, and the
					temperature parameter controls the randomness of the output.
				</p>
			</section>

			<section>
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					Next Steps
				</h2>
				<p className="mb-4">
					Now that you&apos;ve made your first API call, you&apos;re
					ready to explore more advanced features. Check out our{" "}
					<a
						href="/documentation/api-reference"
						className="text-emerald-700 hover:underline"
					>
						API Reference
					</a>{" "}
					for detailed information on all available endpoints,
					parameters, and response formats.
				</p>
				<p>
					For more complex usage scenarios and ideas on how to
					integrate our API into your applications, visit our{" "}
					<a
						href="/documentation/examples"
						className="text-emerald-700 hover:underline"
					>
						Examples
					</a>{" "}
					page.
				</p>
			</section>
		</div>
	)
}

export default GettingStarted
