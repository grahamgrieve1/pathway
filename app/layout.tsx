import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pathway - Immigration Advisor',
  description: 'Your global immigration advisor for international couples',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
