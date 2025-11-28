import type { Song, Artist, Genre, Category } from '../prisma/db/client'

export type SongWithRelations = Song & {
  artist: Artist
  genre: Genre
  category: Category
}
