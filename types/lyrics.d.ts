export interface SongWithLyrics {
    id: string
    title: string
    slug: string
    coverImage: string | null
    lyrics: string
    artistId: string
    genreId: string
    categoryId: string
    views: number
    createdAt: Date
    updatedAt: Date
    artist: {
      id: string
      name: string
      description: string | null
      image: string | null
    }
    genre: {
      id: string
      name: string
      description: string | null
    }
    category: {
      id: string
      name: string
      description: string | null
    }
  }
  
  export interface LyricLine {
    english: string
    indonesian: string
  }