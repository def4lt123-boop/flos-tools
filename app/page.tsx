```tsx
'use client'

import { useEffect, useState } from 'react'
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

      <section className="relative h-screen flex items-center justify-center px-6">

        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />

        <div className="relative z-10 text-center max-w-5xl">

          <div className="mb-8 inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">

            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

            <span className="text-sm text-gray-300">
              Premium Tools & Tutorials
            </span>

          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none">

            Flos
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {' '}Tools
            </span>

          </h1>

          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">

            Eine moderne Sammlung von Apps,
            Programmen, Tutorials, Downloads
            und hilfreichen Tools.

          </p>

        </div>

      </section>

      <section className="max-w-7xl mx-auto px-6 pb-32">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {posts.map((post) => (

            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group cursor-pointer rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:scale-[1.02] transition-all duration-300"
            >

              {post.image_url && (

                <div className="overflow-hidden">

                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                </div>

              )}

              <div className="p-7">

                <h2 className="text-3xl font-bold mb-4">
                  {post.title}
                </h2>

                <p className="text-gray-400 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>

      {selectedPost && (

        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl overflow-auto">

          <div className="max-w-5xl mx-auto p-6 py-20">

            <button
              onClick={() => setSelectedPost(null)}
              className="mb-8 px-6 py-3 rounded-2xl bg-white/10 border border-white/10"
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

            {selectedPost.apk_url && (

              <a
                href={selectedPost.apk_url}
                target="_blank"
                className="inline-block px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-xl font-bold"
              >
                Download starten
              </a>

            )}

          </div>

        </div>

      )}

    </main>
  )
}
```
