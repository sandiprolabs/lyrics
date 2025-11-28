'use client'

import { useState, useEffect } from 'react'
import { SongWithLyrics } from '@/types/lyrics'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ChevronUp, ChevronDown, Copy, Check } from 'lucide-react'

interface LyricsDisplayProps {
  song: SongWithLyrics
}

interface LyricLine {
  english: string
  indonesian: string
}

export default function LyricsDisplay({ song }: LyricsDisplayProps) {
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      const parsedLyrics = JSON.parse(song.lyrics)
      setLyrics(Array.isArray(parsedLyrics) ? parsedLyrics : [])
    } catch (error) {
      console.error('Error parsing lyrics:', error)
      setLyrics([])
    }
  }, [song.lyrics])

  const displayLyrics = isExpanded ? lyrics : lyrics.slice(0, 10)

  const copyLyrics = async () => {
    const fullLyrics = lyrics
      .map(line => `${line.english}\n${line.indonesian}`)
      .join('\n\n')
    
    try {
      await navigator.clipboard.writeText(fullLyrics)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy lyrics:', error)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl">{song.title}</CardTitle>
          <p className="text-muted-foreground">{song.artist.name}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={copyLyrics}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Tersalin!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Salin
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayLyrics.map((line, index) => (
          <div key={index} className="space-y-2">
            <p className="font-medium text-lg">{line.english}</p>
            <p className="text-muted-foreground italic">{line.indonesian}</p>
            {index < displayLyrics.length - 1 && <Separator />}
          </div>
        ))}
        
        {lyrics.length > 10 && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Tampilkan Lebih Sedikit
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Tampilkan Selengkapnya ({lyrics.length - 10} baris lagi)
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}