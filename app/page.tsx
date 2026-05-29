'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function HomePage() {

  const [posts, setPosts] = useState<any[]>([])
  const [selectedPost, setSelectedPost] = useState<any>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {

    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('id', { ascending: false })

    if (data) {
      setPosts(data)
    }
  }

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

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {posts.map((post) => (

            <motion.div
              whileHover={{ y: -10 }}
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="cursor-pointer rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl"
            >

              {post.image_url && (

                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-64 object-cover"
                />

              )}

              <div className="p-7">

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

                <img
                  src={selectedPost.image_url}
                  alt={selectedPost.title}
                  className="w-full rounded-3xl mb-10 max-h-[500px] object-cover"
                />

              )}

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