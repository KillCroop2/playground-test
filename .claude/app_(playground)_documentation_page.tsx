"use client"
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function Documentation() {
    const [error, setError] = useState<string | null>(null)

    return (
        <>
			<h1 className="text-2xl font-bold mb-4">Playground Documentation</h1>
			{error && (
				<div
					className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
					role="alert"
				>
					<strong className="font-bold">Error: </strong>
					<span className="block sm:inline">{error}</span>
				</div>
			)}
			<Card className="flex flex-row h-full gap-x-4 p-6"></Card>
        </>
    )
}