import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const songs = await db.song.findMany({
      include: {
        artist: true,
        genre: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(songs)
  } catch (error) {
    console.error('Error fetching songs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      coverImage,
      lyrics,
      artistId,
      genreId,
      categoryId
    } = body

    const song = await db.song.create({
      data: {
        title,
        slug,
        coverImage,
        lyrics,
        artistId,
        genreId,
        categoryId,
      },
      include: {
        artist: true,
        genre: true,
        category: true,
      }
    })

    return NextResponse.json(song, { status: 201 })
  } catch (error) {
    console.error('Error creating song:', error)
    return NextResponse.json(
      { error: 'Failed to create song' },
      { status: 500 }
    )
  }
}