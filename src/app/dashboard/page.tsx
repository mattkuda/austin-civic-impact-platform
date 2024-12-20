"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for suggestions
const mockSuggestions = [
  { id: 1, title: "Add more bike lanes", category: "Transportation", sentiment: "Positive", votes: 15, status: "Triaged" },
  { id: 2, title: "Expand community gardens", category: "Parks", sentiment: "Positive", votes: 10, status: "In Progress" },
  // Add more mock suggestions as needed
]

export default function SuggestionsDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortBy, setSortBy] = useState("mostVotes")

  const filteredSuggestions = mockSuggestions
    .filter((suggestion) =>
      suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "" || suggestion.category === categoryFilter)
    )
    .sort((a, b) => {
      if (sortBy === "mostVotes") return b.votes - a.votes
      if (sortBy === "newest") return b.id - a.id
      return a.id - b.id
    })

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">ACIP</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/">Home</Link>
              <Link href="/submit">Submit Suggestion</Link>
              <Link href="/dashboard">Dashboard</Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-6">Suggestions Dashboard</h1>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search suggestions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-1/3"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Parks">Parks</SelectItem>
                {/* Add more categories as needed */}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mostVotes">Most Votes</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSuggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardHeader>
                  <CardTitle>{suggestion.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Category: {suggestion.category}</p>
                  <p>Sentiment: {suggestion.sentiment}</p>
                  <p>Status: {suggestion.status}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" className="w-full">
                    Upvote ({suggestion.votes})
                  </Button>
                  <Button variant="outline" className="w-full ml-2">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <footer className="w-full py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by the community, for the community.
          </p>
        </div>
      </footer>
    </div>
  )
}

