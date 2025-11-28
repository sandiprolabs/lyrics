import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const genres = await db.genre.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(genres)
  } catch (error) {
    console.error('Error fetching genres:', error)
    return NextResponse.json(
      { error: 'Failed to fetch genres' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    const genre = await db.genre.create({
      data: {
        name,
        description,
      }
    })

    return NextResponse.json(genre, { status: 201 })
  } catch (error) {
    console.error('Error creating genre:', error)
    return NextResponse.json(
      { error: 'Failed to create genre' },
      { status: 500 }
    )
  }
}