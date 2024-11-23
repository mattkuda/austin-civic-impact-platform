import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import "./globals.css"
import Providers from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen bg-gray-50 px-4">
            <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
              <div className="container max-w-7xl mx-auto flex h-16 items-center">
                <Link className="flex items-center space-x-2" href="/">
                  <span className="font-bold text-xl" style={{ color: "#04D5FF" }}>ACIP</span>
                </Link>
                <div className="flex-1 flex justify-end items-center space-x-6">
                  <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
                    <Link href="/events" className="text-gray-700 hover:text-gray-900">Events</Link>
                    <Link href="/requests" className="text-gray-700 hover:text-gray-900">Requests</Link>
                  </nav>
                  <Button asChild size="sm" className="bg-gradient-to-r from-primary to-secondary text-white">
                    <Link href="/submit" className="flex items-center gap-2">
                      Create Request
                      <Plus className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </header>
            {children}
            <footer className="w-full py-6 bg-white border-t">
              <div className="container max-w-7xl mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-gray-600 md:text-left">
                  Built by the community, for the community.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
