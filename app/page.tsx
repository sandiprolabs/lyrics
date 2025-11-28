'use client'
import { useState, useEffect } from 'react'
import { Song, Artist, Genre, Category } from '../prisma/db/client'
import SongCard from '@/components/SongCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Music, Search, Filter } from 'lucide-react'
export default function Home() {
  const [songs, setSongs] = useState<SongWithRelations[]>([])
  const [filteredSongs, setFilteredSongs] = useState<SongWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [genres, setGenres] = useState<Genre[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchSongs()
    fetchGenres()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterSongs()
  }, [songs, searchQuery, selectedGenre, selectedCategory])

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs')
      if (response.ok) {
        const data = await response.json()
        setSongs(data)
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/genres')
      if (response.ok) {
        const data = await response.json()
        setGenres(data)
      }
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const filterSongs = () => {
    let filtered = songs

    if (searchQuery) {
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedGenre !== 'all') {
      filtered = filtered.filter(song => song.genreId === selectedGenre)
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(song => song.categoryId === selectedCategory)
    }

    setFilteredSongs(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <section className="text-center space-y-4 py-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Lirik Lagu Bilingual
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Temukan lirik lagu favorit Anda dengan terjemahan bahasa Indonesia.
              Nikmati pengalaman musik yang lebih mendalam dengan pemahaman lengkap.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">Pop</Badge>
              <Badge variant="secondary">Rock</Badge>
              <Badge variant="secondary">Jazz</Badge>
              <Badge variant="secondary">R&B</Badge>
              <Badge variant="secondary">K-Pop</Badge>
            </div>
          </section>

          {/* Filter Section */}
          <section className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Filter Lagu</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari judul atau artis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Genre</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedGenre('all')
                  setSelectedCategory('all')
                }}
              >
                Reset Filter
              </Button>
            </div>
          </section>

          {/* Songs Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {searchQuery || selectedGenre !== 'all' || selectedCategory !== 'all'
                  ? `Hasil Pencarian (${filteredSongs.length})`
                  : `Semua Lagu (${filteredSongs.length})`}
              </h2>
            </div>

            {filteredSongs.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Music className="w-16 h-16 mx-auto text-muted-foreground" />
                <h3 className="text-xl font-semibold">Tidak ada lagu ditemukan</h3>
                <p className="text-muted-foreground">
                  Coba ubah filter atau kata kunci pencarian Anda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSongs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
