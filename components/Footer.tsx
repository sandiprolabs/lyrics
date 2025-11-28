import Link from 'next/link'
import { Music, Github, Twitter, Facebook } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <Music className="w-6 h-6 text-primary" />
              LirikKu
            </div>
            <p className="text-sm text-muted-foreground">
              Platform lirik lagu bilingual terlengkap dengan terjemahan bahasa Indonesia.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Menu</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/songs" className="text-muted-foreground hover:text-primary">
                  Semua Lagu
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-muted-foreground hover:text-primary">
                  Artis
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-muted-foreground hover:text-primary">
                  Genre
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Kategori</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/pop" className="text-muted-foreground hover:text-primary">
                  Pop
                </Link>
              </li>
              <li>
                <Link href="/category/rock" className="text-muted-foreground hover:text-primary">
                  Rock
                </Link>
              </li>
              <li>
                <Link href="/category/jazz" className="text-muted-foreground hover:text-primary">
                  Jazz
                </Link>
              </li>
              <li>
                <Link href="/category/rb" className="text-muted-foreground hover:text-primary">
                  R&B
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Tentang</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2024 LirikKu. Semua hak dilindungi.</p>
          <p>Dibuat dengan ❤️ untuk pecinta musik Indonesia</p>
        </div>
      </div>
    </footer>
  )
}