import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Guajiro Digital — Periodismo independiente sobre Cuba',
  description:
    'Cobertura independiente de la realidad cubana: apagones, represión, economía, protestas, exilio y más.',
  openGraph: {
    title: 'Guajiro Digital',
    description: 'Periodismo independiente sobre Cuba',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-bg">{children}</body>
    </html>
  )
}
