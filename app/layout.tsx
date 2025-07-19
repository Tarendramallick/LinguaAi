import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LinguaAi',
  description: 'Created By Tarendra Mallick',
  generator: 'http://tarendra-mallick.vercel.app/',
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
