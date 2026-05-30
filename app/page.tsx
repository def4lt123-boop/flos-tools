'use client'

import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Search } from 'lucide-react'

type Post = {
  id: number
  title: string
  description: string
  image_url: string
  file_url: string
  category: 'program' | 'tutorial' | 'apk'
  created_at: string
}

export default function HomePage() {

  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadPosts() {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('id', { ascending: false })

      if (data) {
        setPosts(data as Post[])
      }
    }

    loadPosts()
  }, [])

  const filteredPosts = useMemo(() => {
    let filtered = posts

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [posts, selectedCategory, searchQuery])

  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden">

      <header className="fixed top-0 left-0 w-full z-40 border-b border-white/10 bg-black/30 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <h1 className="text-2xl font-black">
            Flos Tools
          </h1>

          <Link
            href="/admin"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 font-bold"
          >
            Admin Login
          </Link>

        </div>

      </header>

      <section className="relative min-h-screen flex items-center justify-center px-6">

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full animate-pulse" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-5xl"
        >

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-300">
              Premium Tools & Tutorials
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black leading-none mb-8">
            Flos
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {' '}Tools
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Moderne Programme, Tutorials,
            Downloads, Apps und Tools.
          </p>

        </motion.div>

      </section>

      <section className="max-w-7xl mx-auto px-5 pb-24">

        <div className="mb-12 space-y-6">

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Suche nach Programmen, Tutorials, APKs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl outline-none text-white placeholder:text-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              Alle ({posts.length})
            </button>
            <button
              onClick={() => setSelectedCategory('program')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                selectedCategory === 'program'
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              💻 Programme ({posts.filter(p => p.category === 'program').length})
            </button>
            <button
              onClick={() => setSelectedCategory('tutorial')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                selectedCategory === 'tutorial'
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              📚 Tutorials ({posts.filter(p => p.category === 'tutorial').length})
            </button>
            <button
              onClick={() => setSelectedCategory('apk')}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                selectedCategory === 'apk'
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              📱 APKs ({posts.filter(p => p.category === 'apk').length})
            </button>
          </div>

        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">
              {searchQuery ? 'Keine Ergebnisse gefunden' : 'Noch keine Beiträge vorhanden'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <motion.div
                whileHover={{ y: -10 }}
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="cursor-pointer rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                {post.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-64 object-cover"
                  />
                )}

                <div className="p-7">
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 text-sm">
                      {post.category === 'program' && '💻 Programm'}
                      {post.category === 'tutorial' && '📚 Tutorial'}
                      {post.category === 'apk' && '📱 APK'}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold mb-4">
                    {post.title}
                  </h2>

                  <p className="text-gray-400 line-clamp-3">
                    {post.description}
                  </p>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </section>

      <AnimatePresence>

        {selectedPost && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl overflow-auto"
          >

            <div className="max-w-5xl mx-auto p-6 py-20">

              <button
                onClick={() => setSelectedPost(null)}
                className="mb-10 px-6 py-3 rounded-2xl bg-white/10 border border-white/10"
              >
                Schließen
              </button>

              {selectedPost.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedPost.image_url}
                  alt={selectedPost.title}
                  className="w-full rounded-3xl mb-10 max-h-[500px] object-cover"
                />
              )}

              <div className="mb-6">
                <span className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30">
                  {selectedPost.category === 'program' && '💻 Programm'}
                  {selectedPost.category === 'tutorial' && '📚 Tutorial'}
                  {selectedPost.category === 'apk' && '📱 APK'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-8">
                {selectedPost.title}
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed whitespace-pre-wrap mb-10">
                {selectedPost.description}
              </p>

              {selectedPost.file_url && (
                <a
                  href={selectedPost.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-xl font-bold"
                >
                  Download öffnen
                </a>
              )}

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </main>
  )
}