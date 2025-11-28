'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Music, Plus, Trash2, Edit, Eye, LogOut, Image as ImageIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Artist {
  id: string
  name: string
}

interface Genre {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

interface LyricLine {
  english: string
  indonesian: string
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [artists, setArtists] = useState<Artist[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [songs, setSongs] = useState<any[]>([])
  
  // Form states
  const [songForm, setSongForm] = useState({
    title: '',
    artistId: '',
    genreId: '',
    categoryId: '',
    coverImage: '',
    lyrics: [{ english: '', indonesian: '' }]
  })
  
  const [artistForm, setArtistForm] = useState({
    name: '',
    description: '',
    image: ''
  })
  
  const [genreForm, setGenreForm] = useState({
    name: '',
    description: ''
  })
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  })

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/login')
      return
    }
    setIsLoggedIn(true)
    setLoading(false)
  }

  const fetchData = async () => {
    try {
      const [artistsRes, genresRes, categoriesRes, songsRes] = await Promise.all([
        fetch('/api/artists'),
        fetch('/api/genres'),
        fetch('/api/categories'),
        fetch('/api/songs')
      ])

      if (artistsRes.ok) setArtists(await artistsRes.json())
      if (genresRes.ok) setGenres(await genresRes.json())
      if (categoriesRes.ok) setCategories(await categoriesRes.json())
      if (songsRes.ok) setSongs(await songsRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.push('/login')
  }

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleAddLyricLine = () => {
    setSongForm(prev => ({
      ...prev,
      lyrics: [...prev.lyrics, { english: '', indonesian: '' }]
    }))
  }

  const handleRemoveLyricLine = (index: number) => {
    setSongForm(prev => ({
      ...prev,
      lyrics: prev.lyrics.filter((_, i) => i !== index)
    }))
  }

  const handleLyricChange = (index: number, field: 'english' | 'indonesian', value: string) => {
    setSongForm(prev => ({
      ...prev,
      lyrics: prev.lyrics.map((line, i) => 
        i === index ? { ...line, [field]: value } : line
      )
    }))
  }

  const handleCreateSong = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const slug = songForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const lyricsJson = JSON.stringify(songForm.lyrics.filter(line => line.english || line.indonesian))
      
      const response = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: songForm.title,
          slug,
          coverImage: songForm.coverImage || null,
          lyrics: lyricsJson,
          artistId: songForm.artistId,
          genreId: songForm.genreId,
          categoryId: songForm.categoryId
        })
      })

      if (response.ok) {
        showMessage('Song created successfully!')
        setSongForm({
          title: '',
          artistId: '',
          genreId: '',
          categoryId: '',
          coverImage: '',
          lyrics: [{ english: '', indonesian: '' }]
        })
        fetchData()
      } else {
        showMessage('Failed to create song', 'error')
      }
    } catch (error) {
      showMessage('Error creating song', 'error')
    }
  }

  const handleCreateArtist = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(artistForm)
      })

      if (response.ok) {
        showMessage('Artist created successfully!')
        setArtistForm({ name: '', description: '', image: '' })
        fetchData()
      } else {
        showMessage('Failed to create artist', 'error')
      }
    } catch (error) {
      showMessage('Error creating artist', 'error')
    }
  }

  const handleCreateGenre = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/genres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(genreForm)
      })

      if (response.ok) {
        showMessage('Genre created successfully!')
        setGenreForm({ name: '', description: '' })
        fetchData()
      } else {
        showMessage('Failed to create genre', 'error')
      }
    } catch (error) {
      showMessage('Error creating genre', 'error')
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      })

      if (response.ok) {
        showMessage('Category created successfully!')
        setCategoryForm({ name: '', description: '' })
        fetchData()
      } else {
        showMessage('Failed to create category', 'error')
      }
    } catch (error) {
      showMessage('Error creating category', 'error')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Music className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Panel</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {message && (
          <Alert className={`mb-6 ${messageType === 'error' ? 'border-destructive' : 'border-green-500'}`}>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="songs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="songs">Songs</TabsTrigger>
            <TabsTrigger value="artists">Artists</TabsTrigger>
            <TabsTrigger value="genres">Genres</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="songs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Song</CardTitle>
                <CardDescription>Create a new song with bilingual lyrics</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSong} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Song Title</Label>
                      <Input
                        id="title"
                        value={songForm.title}
                        onChange={(e) => setSongForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="coverImage">Cover Image URL</Label>
                      <Input
                        id="coverImage"
                        value={songForm.coverImage}
                        onChange={(e) => setSongForm(prev => ({ ...prev, coverImage: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Artist</Label>
                      <Select value={songForm.artistId} onValueChange={(value) => setSongForm(prev => ({ ...prev, artistId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select artist" />
                        </SelectTrigger>
                        <SelectContent>
                          {artists.map((artist) => (
                            <SelectItem key={artist.id} value={artist.id}>
                              {artist.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Genre</Label>
                      <Select value={songForm.genreId} onValueChange={(value) => setSongForm(prev => ({ ...prev, genreId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre.id} value={genre.id}>
                              {genre.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={songForm.categoryId} onValueChange={(value) => setSongForm(prev => ({ ...prev, categoryId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Lyrics (Bilingual)</Label>
                      <Button type="button" onClick={handleAddLyricLine} size="sm" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Line
                      </Button>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {songForm.lyrics.map((line, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="English lyrics"
                              value={line.english}
                              onChange={(e) => handleLyricChange(index, 'english', e.target.value)}
                            />
                            <Input
                              placeholder="Indonesian translation"
                              value={line.indonesian}
                              onChange={(e) => handleLyricChange(index, 'indonesian', e.target.value)}
                            />
                          </div>
                          {songForm.lyrics.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveLyricLine(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Create Song
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Songs</CardTitle>
                <CardDescription>Manage your song library</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {songs.map((song) => (
                    <div key={song.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{song.title}</h3>
                        <p className="text-sm text-muted-foreground">{song.artist.name}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">{song.genre.name}</Badge>
                          <Badge variant="outline">{song.category.name}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/lyrics/${song.slug}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="artists">
            <Card>
              <CardHeader>
                <CardTitle>Add New Artist</CardTitle>
                <CardDescription>Create a new artist profile</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateArtist} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="artistName">Artist Name</Label>
                    <Input
                      id="artistName"
                      value={artistForm.name}
                      onChange={(e) => setArtistForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="artistDescription">Description</Label>
                    <Textarea
                      id="artistDescription"
                      value={artistForm.description}
                      onChange={(e) => setArtistForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="artistImage">Image URL</Label>
                    <Input
                      id="artistImage"
                      value={artistForm.image}
                      onChange={(e) => setArtistForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/artist-image.jpg"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Create Artist
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="genres">
            <Card>
              <CardHeader>
                <CardTitle>Add New Genre</CardTitle>
                <CardDescription>Create a new music genre</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateGenre} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="genreName">Genre Name</Label>
                    <Input
                      id="genreName"
                      value={genreForm.name}
                      onChange={(e) => setGenreForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="genreDescription">Description</Label>
                    <Textarea
                      id="genreDescription"
                      value={genreForm.description}
                      onChange={(e) => setGenreForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Create Genre
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>Create a new song category</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input
                      id="categoryName"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">Description</Label>
                    <Textarea
                      id="categoryDescription"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Create Category
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}