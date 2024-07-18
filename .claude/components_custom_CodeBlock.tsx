import React from "react"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

// Import all languages you want to use
import python from "react-syntax-highlighter/dist/esm/languages/prism/python"
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript"
import json from "react-syntax-highlighter/dist/esm/languages/prism/json"
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash"
import http from 'react-syntax-highlighter/dist/esm/languages/prism/http';



// Register the languages
SyntaxHighlighter.registerLanguage("python", python)
SyntaxHighlighter.registerLanguage("javascript", javascript)
SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('http', http);

interface CodeBlockProps {
	code: string
	language?: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = "python" }) => {
	return (
		<SyntaxHighlighter
			language={language}
			style={vscDarkPlus}
			customStyle={{
				margin: 0,
				padding: "1rem",
				borderRadius: "0.375rem",
				fontSize: "16px",
			}}
			wrapLines={true}
			wrapLongLines={true}
		>
			{code.trim()}
		</SyntaxHighlighter>
	)
}

export default CodeBlock
