import { SiteHeader } from "@/components/site-header"
import { SearchSection } from "@/components/search-section"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container px-4 py-16 md:py-24">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your global immigration advisor, that always knows your context.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Pathway is your lifetime immigration advisor for international couples. Upload your information, once. Get answers in seconds on immigration timelines, residency requirements, etc., for the US, EU countries, and anywhere else.
            </p>
          </div>
          <SearchSection />
        </div>
      </main>
    </div>
  )
}

