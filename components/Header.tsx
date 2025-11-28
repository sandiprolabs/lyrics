'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Music, Home, Settings, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchLyrics from './SearchLyrics'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Music className="w-6 h-6 text-primary" />
            LirikKu
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <SearchLyrics onSearch={(query) => {
            // Navigate to search results or filter on current page
            console.log('Search:', query)
          }} />
        </div>
      </div>
    </header>
  )
}