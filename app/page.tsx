'use client'

import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { Search, ChevronDown } from 'lucide-react'

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

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden">

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 w-full z-40 border-b border-white/10 bg-black/30 backdrop-blur-xl"
      >

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-black"
          >
            Flo's Tools
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/admin"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 font-bold hover:scale-105 transition-transform"
            >
              Admin Login
            </Link>
          </motion.div>

        </div>

      </motion.header>

      <section className="relative min-h-screen flex items-center justify-center px-6">

        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-3xl rounded-full"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center max-w-5xl"
        >

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 rounded-full bg-green-400"
            />
            <span className="text-sm text-gray-300">
              Premium Tools & Tutorials
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black leading-none mb-8"
          >
            Flo's
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            >
              {' '}Tools
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Meine Sammlung für Programme, Tutorials,
            Downloads, Apps und Tools
          </motion.p>

        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          onClick={scrollToContent}
        >
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm text-gray-400"
          >
            Scroll runter
          </motion.p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="p-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl"
          >
            <ChevronDown size={24} className="text-gray-400" />
          </motion.div>
        </motion.div>

      </section>

      <section className="max-w-7xl mx-auto px-5 pb-24">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 space-y-6"
        >

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Suche nach Programmen, Tutorials, APKs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl outline-none text-white placeholder:text-gray-400 focus:border-cyan-400/50 transition-colors"
            />
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {[
              { key: 'all', label: 'Alle', count: posts.length },
              { key: 'program', label: '💻 Programme', count: posts.filter(p => p.category === 'program').length },
              { key: 'tutorial', label: '📚 Tutorials', count: posts.filter(p => p.category === 'tutorial').length },
              { key: 'apk', label: '📱 APKs', count: posts.filter(p => p.category === 'apk').length }
            ].map((cat, index) => (
              <motion.button
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-500'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                {cat.label} ({cat.count})
              </motion.button>
            ))}
          </motion.div>

        </motion.div>

        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-gray-400">
              {searchQuery ? 'Keine Ergebnisse gefunden' : 'Noch keine Beiträge vorhanden'}
            </p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="cursor-pointer rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:border-cyan-400/30 transition-all"
              >
                {post.image_url && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                    />
                  </motion.div>
                )}

                <div className="p-7">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-4"
                  >
                    <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 text-sm">
                      {post.category === 'program' && '💻 Programm'}
                      {post.category === 'tutorial' && '📚 Tutorial'}
                      {post.category === 'apk' && '📱 APK'}
                    </span>
                  </motion.div>

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

            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 25 }}
              className="max-w-5xl mx-auto p-6 py-20"
            >

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPost(null)}
                className="mb-10 px-6 py-3 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 transition-colors"
              >
                Schließen
              </motion.button>

              {selectedPost.image_url && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPost.image_url}
                    alt={selectedPost.title}
                    className="w-full rounded-3xl mb-10 max-h-[500px] object-cover"
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <span className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30">
                  {selectedPost.category === 'program' && '💻 Programm'}
                  {selectedPost.category === 'tutorial' && '📚 Tutorial'}
                  {selectedPost.category === 'apk' && '📱 APK'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl font-black mb-8"
              >
                {selectedPost.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-300 leading-relaxed whitespace-pre-wrap mb-10"
              >
                {selectedPost.description}
              </motion.p>

              {selectedPost.file_url && (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={selectedPost.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-xl font-bold"
                >
                  Download öffnen
                </motion.a>
              )}

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </main>
  )
}