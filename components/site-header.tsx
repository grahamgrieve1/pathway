import Link from "next/link"
import { Button } from "../components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-white">
          Pathway
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" className="text-white hover:text-white/90">
            Home
          </Button>
          <Button variant="secondary" className="bg-blue-100 text-black hover:bg-blue-200">
            Sign Up
          </Button>
          <Button variant="secondary" className="bg-white text-black hover:bg-gray-100">
            Log In
          </Button>
        </nav>
      </div>
    </header>
  )
} 