'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { SongWithLyrics } from '@/types/lyrics'
import LyricsDisplay from '@/components/LyricsDisplay'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Music } from 'lucide-react'
import Link from 'next/link'

export default function LyricsPage() {
  const params = useParams()
  const slug = params.slug as string
  const [song, setSong] = useState<SongWithLyrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetchSong()
    }
  }, [slug])

  const fetchSong = async () => {
    try {
      const response = await fetch(`/api/songs/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setSong(data)
      }
    } catch (error) {
      console.error('Error fetching song:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!song) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center space-y-4 py-12">
            <Music className="w-16 h-16 mx-auto text-muted-foreground" />
            <h1 className="text-2xl font-bold">Lirik tidak ditemukan</h1>
            <p className="text-muted-foreground">
              Maaf, lirik yang Anda cari tidak tersedia.
            </p>
            <Link href="/">
              <Button className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
          
          <LyricsDisplay song={song} />
        </div>
      </main>
      <Footer />
    </div>
  )
}