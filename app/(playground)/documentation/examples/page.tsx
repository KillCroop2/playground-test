import React from "react"
import { Card } from "@/components/ui/card"
import CodeBlock from "@/components/custom/CodeBlock"

const Examples = () => {
	return (
		<div className="min-h-screen mx-auto p-8 w-full md:w-2/3 lg:w-1/2 text-neutral-700">
			<h1 className="text-3xl text-neutral-900 font-bold mb-6">
				API Usage Examples
			</h1>

			<section className="mb-8">
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					1. Basic Chat Completion
				</h2>
				<p className="mb-4">
					This example demonstrates how to generate a simple chat
					completion. It&apos;s useful for creating conversational AI,
					question-answering systems, or any application that requires
					natural language interaction.
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
        {"role": "user", "content": "What's the capital of France?"}
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
					In this example, we set a system message to define the
					AI&apos;s role, then ask a question. The temperature
					parameter (0.7) controls the randomness of the output -
					lower values make the output more deterministic, while
					higher values introduce more variety.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					2. Streaming Chat Completion
				</h2>
				<p className="mb-4">
					Streaming allows you to receive the AI&apos;s response in
					real-time, as it&apos;s being generated. This is
					particularly useful for creating more responsive user
					interfaces or for processing very long responses.
				</p>
				<Card className="bg-neutral-800 p-1 mb-4 rounded-md">
					<CodeBlock
						code={`import requests
import json

url = "http://localhost:5000/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "model": "llama2",
    "messages": [
        {"role": "user", "content": "Tell me a short story about a robot."}
    ],
    "stream": True
}

response = requests.post(url, headers=headers, json=data, stream=True)

for line in response.iter_lines():
    if line:
        chunk = json.loads(line.decode('utf-8').split('data: ')[1])
        print(chunk['choices'][0]['delta'].get('content', ''), end='', flush=True)`}
						language="python"
					/>
				</Card>
				<p className="mb-4">
					This script sends a streaming request and prints each chunk
					of the response as it&apos;s received. This allows for
					real-time display of the AI&apos;s output, which can
					significantly improve the perceived responsiveness of your
					application.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					3. Listing Available Models
				</h2>
				<p className="mb-4">
					Before making a chat completion request, you might want to
					know which models are available to you. This example shows
					how to retrieve a list of all available models.
				</p>
				<Card className="bg-neutral-800 p-1 mb-4 rounded-md">
					<CodeBlock
						code={`import requests

url = "http://localhost:5000/v1/models"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}

response = requests.get(url, headers=headers)
models = response.json()

for model in models['data']:
    print(f"Model ID: {model['id']}, Created: {model['created']}")`}
						language="python"
					/>
				</Card>
				<p className="mb-4">
					This script retrieves all available models and prints their
					IDs and creation dates. You can use this information to
					choose the most appropriate model for your use case.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					4. Creating a New API Key
				</h2>
				<p className="mb-4">
					If you need to generate a new API key, perhaps for a new
					project or to rotate your keys for security reasons, you can
					use the following example:
				</p>
				<Card className="bg-neutral-800 p-1 mb-4 rounded-md">
					<CodeBlock
						code={`import requests

url = "http://localhost:5000/v1/api_keys"
headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, headers=headers)
result = response.json()
print(f"Your new API key is: {result['api_key']}")
print("Make sure to save this key securely, as you won't be able to retrieve it later.")`}
						language="python"
					/>
				</Card>
				<p className="mb-4">
					This script creates a new API key and prints it. Remember to
					store this key securely, as it won&apos;t be displayed again
					for security reasons.
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					5. Multi-turn Conversation
				</h2>
				<p className="mb-4">
					This example demonstrates how to have a multi-turn
					conversation with the AI, maintaining context across
					multiple messages.
				</p>
				<Card className="bg-neutral-800 p-1 mb-4 rounded-md">
					<CodeBlock
						code={`import requests

url = "http://localhost:5000/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

conversation = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hi, I'm planning a trip to Paris."},
    {"role": "assistant", "content": "That's exciting! Paris is a beautiful city with lots to see and do. What would you like to know about planning your trip?"},
    {"role": "user", "content": "What are the top 3 must-visit attractions?"}
]

data = {
    "model": "llama2",
    "messages": conversation,
    "temperature": 0.7
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
assistant_response = result["choices"][0]["message"]["content"]
print(f"Assistant: {assistant_response}")

# Continue the conversation
conversation.append({"role": "assistant", "content": assistant_response})
conversation.append({"role": "user", "content": "Great! How many days should I plan for these attractions?"})

data["messages"] = conversation
response = requests.post(url, headers=headers, json=data)
result = response.json()
assistant_response = result["choices"][0]["message"]["content"]
print(f"Assistant: {assistant_response}")`}
						language="python"
					/>
				</Card>
				<p className="mb-4">
					This script demonstrates a back-and-forth conversation,
					maintaining context by including the full conversation
					history in each request. This allows the AI to provide
					coherent and contextually relevant responses.
				</p>
			</section>

			<section>
				<h2 className="text-2xl text-neutral-900 font-bold mb-4">
					6. Using JSON Mode
				</h2>
				<p className="mb-4">
					If you need the AI to generate responses in a specific JSON
					format, you can use the JSON mode. This is particularly
					useful for creating structured data or for integration with
					other systems.
				</p>
				<Card className="bg-neutral-800 p-1 mb-4 rounded-md">
					<CodeBlock
						code={`import requests
import json

url = "http://localhost:5000/v1/chat/completions"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "model": "llama2",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant that responds in JSON format."},
        {"role": "user", "content": "Give me a recipe for spaghetti carbonara with ingredients and steps."}
    ],
    "response_format": {"type": "json_object"},
    "temperature": 0.7
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
recipe = json.loads(result["choices"][0]["message"]["content"])

print(json.dumps(recipe, indent=2))`}
						language="python"
					/>
				</Card>
				<p className="mb-4">
					This example requests a recipe in JSON format. The response
					will be a structured JSON object containing the recipe
					details, which can be easily parsed and used in your
					application.
				</p>
			</section>
		</div>
	)
}

export default Examples
