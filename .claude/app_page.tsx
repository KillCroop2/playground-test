"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Github,
	Code,
	Server,
	Cpu,
	Palette,
	MessageSquare,
	Layout,
	Database,
	Zap,
	FlaskConical,
    FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"

const LandingPage = () => {
    const router = useRouter()
	return (
		<div className="min-h-screen flex flex-col">
			{/* Navbar */}
			<nav className="bg-white shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex items-center">
							<span className="text-xl font-bold">
								Chat AI Playground
							</span>
						</div>
						<div className="flex items-center">
							<a
								href="#"
								className="text-gray-700 hover:text-gray-900 px-3 py-2"
							>
								Home
							</a>
							<a
								href="#"
								className="text-gray-700 hover:text-gray-900 px-3 py-2"
							>
								About
							</a>
							<a
								href="#"
								className="text-gray-700 hover:text-gray-900 px-3 py-2"
							>
								Docs
							</a>
							<a
								href="https://github.com"
								className="text-gray-700 hover:text-gray-900 px-3 py-2"
							>
								<Github size={24} />
							</a>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="flex-grow">
				{/* Hero Section */}
				<section className="bg-gray-50 py-20">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center">
							<h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
								Chat AI Playground
							</h1>
							<p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
								An open-source project that creates an Ollama
								API wrapper for Flask and provides an AI
								playground frontend.
							</p>
							<div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
								<Button onClick={(e) => router.push("/documentation")} className="mr-4"><FileText className="w-5 h-5 mr-2" /> Get Started</Button>
								<Button onClick={(e) => router.push("/playground")} variant="outline"><FlaskConical className="w-5 h-5 mr-2" /> Playground demo</Button>
							</div>
						</div>
					</div>
				</section>

				{/* Project Description */}
				<section className="py-16">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-extrabold text-gray-900">
							About the Project
						</h2>
						<div className="mt-6 text-gray-500">
							<p>
								Chat AI Playground is an innovative open-source
								project that bridges the gap between
								Ollama&apos;s powerful AI capabilities and
								user-friendly interfaces. By creating a
								Flask-based API wrapper for Ollama and coupling
								it with an interactive frontend, we&apos;ve made
								AI experimentation accessible to developers and
								enthusiasts alike.
							</p>
						</div>
					</div>
				</section>

				{/* Statistics */}
				<section className="bg-gray-50 py-16">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Users
									</CardTitle>
									<Github className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										1,000+
									</div>
									<p className="text-xs text-muted-foreground">
										+20% from last month
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										API Calls
									</CardTitle>
									<Code className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										500K+
									</div>
									<p className="text-xs text-muted-foreground">
										+15% from last month
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Contributors
									</CardTitle>
									<Server className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										50+
									</div>
									<p className="text-xs text-muted-foreground">
										From 10 countries
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										AI Models
									</CardTitle>
									<Cpu className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">
										10+
									</div>
									<p className="text-xs text-muted-foreground">
										Compatible with Ollama
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Specifications */}
				<section className="py-16">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl font-extrabold text-gray-900 mb-12 text-center">
							Project Specifications
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							<div>
								<h3 className="text-2xl font-semibold mb-6 flex items-center">
									<Server className="mr-2 text-blue-600" />
									Backend (Flask API Wrapper)
								</h3>
								<div className="space-y-6">
									<div className="flex items-start">
										<FlaskConical className="mr-4 text-green-500 flex-shrink-0" />
										<div>
											<h4 className="font-semibold mb-1">
												Flask-based RESTful API
											</h4>
											<p className="text-gray-600">
												Robust and scalable API
												architecture using Flask
												framework
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<Database className="mr-4 text-green-500 flex-shrink-0" />
										<div>
											<h4 className="font-semibold mb-1">
												Ollama Integration
											</h4>
											<p className="text-gray-600">
												Seamless access to AI models
												through Ollama integration
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<Zap className="mr-4 text-green-500 flex-shrink-0" />
										<div>
											<h4 className="font-semibold mb-1">
												Efficient Request Handling
											</h4>
											<p className="text-gray-600">
												Optimized for quick responses
												and streaming capabilities
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<Code className="mr-4 text-green-500 flex-shrink-0" />
										<div>
											<h4 className="font-semibold mb-1">
												Customizable Endpoints
											</h4>
											<p className="text-gray-600">
												Flexible API endpoints to suit
												various use cases
											</p>
										</div>
									</div>
								</div>
							</div>
							<div>
								<h3 className="text-2xl font-semibold mb-6 flex items-center">
									<Layout className="mr-2 text-blue-600" />
									Frontend (AI Playground)
								</h3>
								<div className="space-y-6">
									<div className="flex items-start">
										<Cpu className="mr-4 text-green-500 flex-shrink-0" />
										<div>
											<h4 className="font-semibold mb-1">
												Next.js Framework
											</h4>
											<p className="text-gray-600">
												Leveraging Next.js for optimal
												performance and SEO
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<MessageSquare className="mr-4 text-green-500 flex-shrink-0" />
										<div>
											<h4 className="font-semibold mb-1">
												Intuitive Chat Interface
											</h4>
											<p className="text-gray-600">
												User-friendly real-time chat for
												interacting with AI models
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<Palette className="mr-4 text-green-500 flex-shrink-0" />
										<div>
											<h4 className="font-semibold mb-1">
												Customizable Themes
											</h4>
											<p className="text-gray-600">
												Flexible theming options to
												match your brand or preferences
											</p>
										</div>
									</div>
									<div className="flex items-start">
										<Layout className="mr-4 text-green-500 flex-shrink-0" />
										<div>
											<h4 className="font-semibold mb-1">
												Responsive Design
											</h4>
											<p className="text-gray-600">
												Optimized for various screen
												sizes and devices
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="bg-gray-100 text-gray-600 py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="mb-4 md:mb-0">
							<span className="text-sm">
								&copy; 2024 Chat AI Playground. All rights
								reserved.
							</span>
						</div>
						<div className="flex space-x-6">
							<a
								href="#"
								className="text-gray-400 hover:text-gray-600"
							>
								<span className="sr-only">GitHub</span>
								<Github className="h-6 w-6" />
							</a>
							<a href="#" className="text-sm hover:text-gray-900">
								Privacy
							</a>
							<a href="#" className="text-sm hover:text-gray-900">
								Terms
							</a>
							<a href="#" className="text-sm hover:text-gray-900">
								Contact
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}

export default LandingPage
