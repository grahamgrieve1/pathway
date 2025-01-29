import './globals.css'

export const metadata = {
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
      <body>{children}</body>
    </html>
  )
}
