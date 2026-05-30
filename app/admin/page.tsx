'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import { Edit2, Trash2, X } from 'lucide-react'

type Post = {
  id: number
  title: string
  description: string
  image_url: string
  file_url: string
  category: 'program' | 'tutorial' | 'apk'
  created_at: string
}

type User = {
  id: string
  email: string
}

export default function AdminPage() {

  const [loading, setLoading] = useState(true)

  const [user, setUser] = useState<User | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'program' | 'tutorial' | 'apk'>('program')

  const [image, setImage] = useState<File | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const [posts, setPosts] = useState<Post[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)

  useEffect(() => {

    checkUser()
    fetchPosts()

  }, [])

  async function checkUser() {

    const { data } = await supabase.auth.getUser()

    if (data.user?.email === 'def4lt123@gmail.com') {
      setUser(data.user as User)
    }

    setLoading(false)
  }

  async function login() {

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      toast.error(error.message)
      return
    }

    if (data.user.email !== 'def4lt123@gmail.com') {
      toast.error('Kein Admin')
      return
    }

    setUser(data.user as User)
  }

  async function logout() {

    await supabase.auth.signOut()

    location.reload()
  }

  async function fetchPosts() {

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('id', { ascending: false })

    console.log(error)

    if (data) {
      setPosts(data as Post[])
    }
  }

  async function savePost() {

    try {

      if (!title || !description) {
        toast.error('Bitte Titel und Beschreibung ausfüllen')
        return
      }

      let imageUrl = ''
      let fileUrl = ''

      if (image) {

        const imageName = `${Date.now()}-${image.name}`

        const imageUpload = await supabase.storage
          .from('images')
          .upload(imageName, image)

        if (imageUpload.error) {
          toast.error(imageUpload.error.message)
          return
        }

        const imageData = supabase.storage
          .from('images')
          .getPublicUrl(imageName)

        imageUrl = imageData.data.publicUrl
      }

      if (file) {

        const fileName = `${Date.now()}-${file.name}`

        const fileUpload = await supabase.storage
          .from('files')
          .upload(fileName, file)

        if (fileUpload.error) {
          toast.error(fileUpload.error.message)
          return
        }

        const fileData = supabase.storage
          .from('files')
          .getPublicUrl(fileName)

        fileUrl = fileData.data.publicUrl
      }

      if (editingPost) {
        // Update existing post
        const update = await supabase
          .from('posts')
          .update({
            title,
            description,
            category,
            image_url: imageUrl || editingPost.image_url,
            file_url: fileUrl || editingPost.file_url
          })
          .eq('id', editingPost.id)

        if (update.error) {
          toast.error(update.error.message)
          return
        }

        toast.success('Post aktualisiert')
        setEditingPost(null)
      } else {
        // Create new post
        const insert = await supabase
          .from('posts')
          .insert([
            {
              title,
              description,
              category,
              image_url: imageUrl,
              file_url: fileUrl
            }
          ])

        if (insert.error) {
          toast.error(insert.error.message)
          return
        }

        toast.success('Post erstellt')
      }

      setTitle('')
      setDescription('')
      setCategory('program')
      setImage(null)
      setFile(null)

      fetchPosts()

    } catch (err) {
      console.log(err)
      toast.error('Fehler beim Upload')
    }
  }

  function startEdit(post: Post) {
    setEditingPost(post)
    setTitle(post.title)
    setDescription(post.description)
    setCategory(post.category || 'program')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingPost(null)
    setTitle('')
    setDescription('')
    setCategory('program')
    setImage(null)
    setFile(null)
  }

  async function deletePost(id: number) {
    const confirmed = confirm('Post löschen?')
    if (!confirmed) return

    const result = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (result.error) {
      toast.error('Fehler beim Löschen')
      return
    }

    toast.success('Post gelöscht')
    fetchPosts()
  }

  if (loading) {

    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        Loading...
      </main>
    )
  }

  if (!user) {

    return (

      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-6">

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10"
        >

          <h1 className="text-5xl font-black mb-10 text-center">

            Admin Login

          </h1>

          <div className="space-y-5">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-5 rounded-2xl bg-black/30 border border-white/10 outline-none"
            />

            <input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 rounded-2xl bg-black/30 border border-white/10 outline-none"
            />

            <button
              onClick={login}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-xl font-bold"
            >
              Login
            </button>

          </div>

        </motion.div>

      </main>

    )
  }

  return (

    <main className="min-h-screen bg-[#050816] text-white p-5 md:p-10">

      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">

          <h1 className="text-5xl md:text-7xl font-black">

            Dashboard

          </h1>

          <button
            onClick={logout}
            className="px-6 py-4 rounded-2xl bg-red-500 font-bold"
          >
            Logout
          </button>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">
                {editingPost ? 'Beitrag bearbeiten' : 'Neuer Beitrag'}
              </h2>
              {editingPost && (
                <button
                  onClick={cancelEdit}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={24} />
                </button>
              )}
            </div>

            <div className="space-y-6">

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titel"
                className="w-full p-5 rounded-2xl bg-black/30 border border-white/10 outline-none"
              />

              <textarea
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Beschreibung / Tutorial"
                className="w-full p-5 rounded-2xl bg-black/30 border border-white/10 outline-none resize-none"
              />

              <div>
                <p className="mb-3 text-gray-400">
                  Kategorie
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setCategory('program')}
                    className={`p-4 rounded-2xl border transition-all ${
                      category === 'program'
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-500 border-transparent'
                        : 'bg-black/30 border-white/10'
                    }`}
                  >
                    Programm
                  </button>
                  <button
                    onClick={() => setCategory('tutorial')}
                    className={`p-4 rounded-2xl border transition-all ${
                      category === 'tutorial'
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-500 border-transparent'
                        : 'bg-black/30 border-white/10'
                    }`}
                  >
                    Tutorial
                  </button>
                  <button
                    onClick={() => setCategory('apk')}
                    className={`p-4 rounded-2xl border transition-all ${
                      category === 'apk'
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-500 border-transparent'
                        : 'bg-black/30 border-white/10'
                    }`}
                  >
                    APK
                  </button>
                </div>
              </div>

              <div>

                <p className="mb-3 text-gray-400">
                  Bild hochladen
                </p>

                <input
                  type="file"
                  accept="image/*"
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
                onClick={savePost}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-xl font-bold"
              >
                {editingPost ? 'Änderungen speichern' : 'Beitrag veröffentlichen'}
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
                  // eslint-disable-next-line @next/next/no-img-element
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

                  <p className="text-gray-400 mb-4 whitespace-pre-wrap line-clamp-3">
                    {post.description}
                  </p>

                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 text-sm">
                      {post.category === 'program' && '💻 Programm'}
                      {post.category === 'tutorial' && '📚 Tutorial'}
                      {post.category === 'apk' && '📱 APK'}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => startEdit(post)}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 font-bold transition-colors"
                    >
                      <Edit2 size={18} />
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500 hover:bg-red-600 font-bold transition-colors"
                    >
                      <Trash2 size={18} />
                      Löschen
                    </button>
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </main>

  )
}