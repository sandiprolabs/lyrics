import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
})

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@lirikku.com' },
    update: {},
    create: {
      email: 'admin@lirikku.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
    },
  })

  const artist1 = await prisma.artist.upsert({
    where: { name: 'The Beatles' },
    update: {},
    create: {
      name: 'The Beatles',
      description: 'Legendary British rock band',
    },
  })

  const artist2 = await prisma.artist.upsert({
    where: { name: 'Ed Sheeran' },
    update: {},
    create: {
      name: 'Ed Sheeran',
      description: 'British singer-songwriter',
    },
  })

  const popGenre = await prisma.genre.upsert({
    where: { name: 'Pop' },
    update: {},
    create: {
      name: 'Pop',
      description: 'Popular music genre',
    },
  })

  const rockGenre = await prisma.genre.upsert({
    where: { name: 'Rock' },
    update: {},
    create: {
      name: 'Rock',
      description: 'Rock music genre',
    },
  })

  const internationalCategory = await prisma.category.upsert({
    where: { name: 'International' },
    update: {},
    create: {
      name: 'International',
      description: 'International songs',
    },
  })

  const balladCategory = await prisma.category.upsert({
    where: { name: 'Ballad' },
    update: {},
    create: {
      name: 'Ballad',
      description: 'Slow romantic songs',
    },
  })

  const lyrics1 = [
    { english: "Imagine there's no heaven", indonesian: "Bayangkan tidak ada surga" },
    { english: "It's easy if you try", indonesian: "Sangat mudah jika kau coba" },
    { english: "No hell below us", indonesian: "Tidak ada neraka di bawah kita" },
    { english: "Above us, only sky", indonesian: "Di atas kita, hanya langit" },
    { english: "Imagine all the people", indonesian: "Bayangkan semua orang" },
    { english: "Living for today", indonesian: "Hidup untuk hari ini" },
  ]

  await prisma.song.create({
    data: {
      title: 'Imagine',
      slug: 'imagine',
      lyrics: JSON.stringify(lyrics1),
      artistId: artist1.id,
      genreId: rockGenre.id,
      categoryId: internationalCategory.id,
      coverImage:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    },
  })

  const lyrics2 = [
    { english: "I found a love for me", indonesian: "Aku menemukan cinta untukku" },
    { english: "Darling, just dive right in and follow my lead", indonesian: "Sayang, terjunlah dan ikuti lead ku" },
    { english: "Well, I found a girl, beautiful and sweet", indonesian: "Nah, aku menemukan gadis, cantik dan manis" },
    { english: "Oh, I never knew you were the someone waiting for me", indonesian: "Oh, aku tidak pernah tahu kau adalah seseorang yang menantiku" },
    { english: "'Cause we were just kids when we fell in love", indonesian: "Karena kita hanya anak-anak saat kita jatuh cinta" },
    { english: "Not knowing what it was", indonesian: "Tidak tahu apa itu" },
  ]

  await prisma.song.create({
    data: {
      title: 'Perfect',
      slug: 'perfect',
      lyrics: JSON.stringify(lyrics2),
      artistId: artist2.id,
      genreId: popGenre.id,
      categoryId: balladCategory.id,
      coverImage:
        'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&h=400&fit=crop',
    },
  })

  console.log('Database seeded successfully')
  console.log('Admin login: admin@lirikku.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
