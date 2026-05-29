'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'

export default function Home() {

  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetchPosts()
  }, [])

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setPosts(data)
  }

  return (
    <main className="min-h-screen bg-[#0b1020] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <section className="py-28 text-center">
          <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
            Flos Tools
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-8">
            Moderne Sammlung von APKs, Apps und nützlichen Tools.
          </p>
        </section>
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -10 }}
              className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl"
            >
              <img src={post.image_url} className="w-full h-56 object-cover" />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                <p className="text-gray-400 mb-6 leading-7">{post.description}</p>
                
                  href={post.apk_url}
                  target="_blank"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-400 px-5 py-3 rounded-2xl w-fit font-semibold"
                >
                  <Download size={18} />
                  Download APK
                </a>
              </div>
            </motion.div>
          ))}
        </section>
      </div>
    </main>
  )
}