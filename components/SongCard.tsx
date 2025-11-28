'use client'

import React from 'react'
import { Song, Artist, Genre, Category } from '../prisma/db/client'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Music } from 'lucide-react'

interface SongWithRelations extends Song {
  artist: Artist
  genre: Genre
  category: Category
}

interface SongCardProps {
  song: SongWithRelations
}

export default function SongCard({ song }: SongCardProps) {
  return (
    <>
    <Link href={`/lyrics/${song.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
        <CardHeader className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              {song.coverImage ? (
                <Image
                  src={song.coverImage}
                  alt={song.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {song.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {song.artist.name}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {song.genre.name}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {song.category.name}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              {song.views}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
    </>
  )
}