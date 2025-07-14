import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinguaAi',
  description: 'Created Tarendra Mallick',
  generator: 'https://tarendra-mallick.vercel.app/',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
