import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pathway - Immigration Advisor',
  description: 'Your global immigration advisor for international couples',
  icons: {
    icon: '/Pathway/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Pathway/favicon.ico" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
