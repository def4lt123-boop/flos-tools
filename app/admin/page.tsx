'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {

  const [user, setUser] = useState<any>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [image, setImage] = useState<File | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {

    checkUser()
    fetchPosts()

  }, [])

  async function checkUser() {

    const { data } = await supabase.auth.getUser()

    if (data.user?.email === 'def4lt123@gmail.com') {
      setUser(data.user)
    }

  }

  async function login() {

    const email = prompt('Admin Email')

    if (!email) return

    await supabase.auth.signInWithOtp({
      email
    })

    alert('Login Link wurde per Mail gesendet.')
  }

  async function fetchPosts() {

    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('id', { ascending: false })

    if (data) {
      setPosts(data)
    }

  }

  async function createPost() {

    if (!title || !description) {
      return alert('Bitte Titel und Beschreibung ausfüllen')
    }

    let imageUrl = ''
    let fileUrl = ''

    if (image) {

      const imageName = `${Date.now()}-${image.name}`

      await supabase.storage
        .from('images')
        .upload(imageName, image)

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(imageName)

      imageUrl = data.publicUrl
    }

    if (file) {

      const fileName = `${Date.now()}-${file.name}`

      await supabase.storage
        .from('files')
        .upload(fileName, file)

      const { data } = supabase.storage
        .from('files')
        .getPublicUrl(fileName)

      fileUrl = data.publicUrl
    }

    await supabase
      .from('posts')
      .insert([
        {
          title,
          description,
          image_url: imageUrl,
          file_url: fileUrl
        }
      ])

    setTitle('')
    setDescription('')
    setImage(null)
    setFile(null)

    fetchPosts()

    alert('Post erstellt')
  }

  async function deletePost(id: number) {

    const confirmed = confirm('Post löschen?')

    if (!confirmed) return

    await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    fetchPosts()
  }

  if (!user) {

    return (

      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-6">

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10"
        >

          <h1 className="text-5xl font-black mb-8 text-center">

            Admin Login

          </h1>

          <button
            onClick={login}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-xl font-bold"
          >
            Login starten
          </button>

        </motion.div>

      </main>

    )
  }

  return (

    <main className="min-h-screen bg-[#050816] text-white p-5 md:p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl md:text-7xl font-black mb-12">

          Admin Dashboard

        </h1>

        <div className="grid lg:grid-cols-2 gap-10">

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

            <h2 className="text-3xl font-bold mb-8">
              Neuer Post
            </h2>

            <div className="space-y-6">

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titel"
                className="w-full p-5 rounded-2xl bg-black/30 border border-white/10 outline-none"
              />

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschreibung / Tutorial"
                rows={8}
                className="w-full p-5 rounded-2xl bg-black/30 border border-white/10 outline-none resize-none"
              />

              <div>

                <p className="mb-3 text-gray-400">
                  Bild hochladen
                </p>

                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />

              </div>

              <div>

                <p className="mb-3 text-gray-400">
                  Datei / Programm / APK / ZIP
                </p>

                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

              </div>

              <button
                onClick={createPost}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-xl font-bold"
              >
                Post veröffentlichen
              </button>

            </div>

          </div>

          <div className="space-y-6">

            {posts.map((post) => (

              <div
                key={post.id}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
              >

                {post.image_url && (

                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                  />

                )}

                <div className="p-6">

                  <h2 className="text-3xl font-bold mb-4">
                    {post.title}
                  </h2>

                  <p className="text-gray-400 mb-6">
                    {post.description}
                  </p>

                  <button
                    onClick={() => deletePost(post.id)}
                    className="px-6 py-3 rounded-2xl bg-red-500 font-bold"
                  >
                    Löschen
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </main>
  )
}