'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'
import { Edit2, Trash2, X, Upload, FileImage, FileArchive, Calendar, Eye, EyeOff } from 'lucide-react'
import Editor from '../components/Editor'
import DeleteModal from '../components/DeleteModal'
import ImagePreview from '../components/ImagePreview'

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

  const router = useRouter()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(true)

  const [user, setUser] = useState<User | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categories, setCategories] = useState<string[]>(['program'])

  const [image, setImage] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])

  const [posts, setPosts] = useState<Post[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {

    checkUser()
    fetchPosts()

    // Listen for Ctrl+S from editor
    const handleEditorSave = () => {
      savePost()
    }
    window.addEventListener('editor-save', handleEditorSave)
    
    // Warn before leaving with unsaved changes
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('editor-save', handleEditorSave)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }

  }, [hasUnsavedChanges])

  // Track changes
  useEffect(() => {
    if (title || description || image || files.length > 0) {
      setHasUnsavedChanges(true)
    } else {
      setHasUnsavedChanges(false)
    }
  }, [title, description, image, files])

  async function checkUser() {

    const { data } = await supabase.auth.getUser()

    if (data.user?.email === 'def4lt123@gmail.com') {
      setUser(data.user as User)
    }

    setLoading(false)
  }

  async function login(e?: React.FormEvent) {
    if (e) {
      e.preventDefault()
    }

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

    router.push('/')
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

  // Funktion zur Bildkomprimierung
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // Max width/height
          const MAX_WIDTH = 1920
          const MAX_HEIGHT = 1080
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          ctx?.drawImage(img, 0, 0, width, height)

          // Konvertiere zu WebP mit 80% Qualität
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                  type: 'image/webp',
                  lastModified: Date.now(),
                })
                resolve(compressedFile)
              } else {
                reject(new Error('Canvas to Blob failed'))
              }
            },
            'image/webp',
            0.8
          )
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }

  async function savePost() {

    try {

      if (!title || !description) {
        toast.error('Bitte Titel und Beschreibung ausfüllen')
        return
      }

      let imageUrl = editingPost?.image_url || ''
      let fileUrl = editingPost?.file_url || ''

      if (image) {
        toast.loading('Komprimiere Bild...', { id: 'upload' })
        const compressedImage = await compressImage(image)
        
        toast.loading('Lade Bild hoch...', { id: 'upload' })
        const imageName = `${Date.now()}-${compressedImage.name}`

        const imageUpload = await supabase.storage
          .from('images')
          .upload(imageName, compressedImage)

        if (imageUpload.error) {
          toast.error(imageUpload.error.message, { id: 'upload' })
          return
        }

        const imageData = supabase.storage
          .from('images')
          .getPublicUrl(imageName)

        imageUrl = imageData.data.publicUrl
      }

      if (files.length > 0) {
        toast.loading(`Lade ${files.length} Datei(en) hoch...`, { id: 'upload' })
        const uploadedUrls: string[] = []

        for (const file of files) {
          const fileName = `${Date.now()}-${file.name}`

          const fileUpload = await supabase.storage
            .from('files')
            .upload(fileName, file)

          if (fileUpload.error) {
            toast.error(fileUpload.error.message, { id: 'upload' })
            return
          }

          const fileData = supabase.storage
            .from('files')
            .getPublicUrl(fileName)

          uploadedUrls.push(fileData.data.publicUrl)
        }

        // Join multiple URLs with a separator
        fileUrl = uploadedUrls.join('|||')
      }

      if (editingPost) {
        // Update existing post
        console.log('=== UPDATE DEBUG ===')
        console.log('Editing post ID:', editingPost.id)
        console.log('Current title:', title)
        console.log('Current description length:', description.length)
        console.log('Current categories:', categories)
        console.log('Image URL:', imageUrl)
        console.log('File URL:', fileUrl)
        console.log('Original post:', editingPost)

        const update = await supabase
          .from('posts')
          .update({
            title: title,
            description: description,
            category: categories.join(','),
            image_url: imageUrl || editingPost.image_url,
            file_url: fileUrl || editingPost.file_url
          })
          .eq('id', editingPost.id)
          .select()

        console.log('Update result:', update)

        if (update.error) {
          toast.error(update.error.message, { id: 'upload' })
          console.error('Update error:', update.error)
          return
        }

        console.log('Post updated successfully. New data:', update.data)
        toast.success('Post aktualisiert', { id: 'upload' })
        setEditingPost(null)
        setTitle('')
        setDescription('')
        setCategories(['program'])
        setImage(null)
        setFiles([])
        fetchPosts()
      } else {
        // Create new post
        const insert = await supabase
          .from('posts')
          .insert([
            {
              title,
              description,
              category: categories.join(','),
              image_url: imageUrl,
              file_url: fileUrl
            }
          ])

        if (insert.error) {
          toast.error(insert.error.message, { id: 'upload' })
          return
        }

        toast.success('Post erstellt', { id: 'upload' })
        setTitle('')
        setDescription('')
        setCategories(['program'])
        setImage(null)
        setFiles([])
        fetchPosts()
      }

    } catch (err) {
      console.log(err)
      toast.error('Fehler beim Upload', { id: 'upload' })
    }
  }

  function startEdit(post: Post) {
    setEditingPost(post)
    setTitle(post.title)
    setDescription(post.description)
    setCategories(post.category ? post.category.split(',') : ['program'])
    setImage(null)
    setFiles([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingPost(null)
    setTitle('')
    setDescription('')
    setCategories(['program'])
    setImage(null)
    setFiles([])
  }

  function openDeleteModal(post: Post) {
    setPostToDelete(post)
    setDeleteModalOpen(true)
  }

  async function confirmDelete() {
    if (!postToDelete) return

    const result = await supabase
      .from('posts')
      .delete()
      .eq('id', postToDelete.id)

    if (result.error) {
      toast.error('Fehler beim Löschen')
      return
    }

    toast.success('Post gelöscht')
    setPostToDelete(null)
    fetchPosts()
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-cyan-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-white/10 border-b-purple-500 animate-spin-reverse" />
            </div>
          </div>
          <p className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
            Lade Dashboard...
          </p>
        </motion.div>
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

          <form onSubmit={login} className="space-y-5">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-5 rounded-2xl bg-black/30 border border-white/10 outline-none"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-5 pr-14 rounded-2xl bg-black/30 border border-white/10 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-xl font-bold hover:scale-105 transition-transform cursor-pointer"
            >
              Login
            </button>

          </form>

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

        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title={postToDelete?.title || ''}
        />

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">

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

              <div className="space-y-2">
                <p className="text-gray-400">Inhalt / Tutorial</p>
                <Editor 
                  content={description} 
                  onChange={setDescription} 
                />
              </div>

              <div>
                <p className="mb-3 text-gray-400">
                  Kategorien (Mehrfachauswahl möglich)
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      if (categories.includes('program')) {
                        setCategories(categories.filter(c => c !== 'program'))
                      } else {
                        setCategories([...categories, 'program'])
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all ${
                      categories.includes('program')
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-500 border-transparent'
                        : 'bg-black/30 border-white/10'
                    }`}
                  >
                    Programm
                  </button>
                  <button
                    onClick={() => {
                      if (categories.includes('tutorial')) {
                        setCategories(categories.filter(c => c !== 'tutorial'))
                      } else {
                        setCategories([...categories, 'tutorial'])
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all ${
                      categories.includes('tutorial')
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-500 border-transparent'
                        : 'bg-black/30 border-white/10'
                    }`}
                  >
                    Tutorial
                  </button>
                  <button
                    onClick={() => {
                      if (categories.includes('apk')) {
                        setCategories(categories.filter(c => c !== 'apk'))
                      } else {
                        setCategories([...categories, 'apk'])
                      }
                    }}
                    className={`p-4 rounded-2xl border transition-all ${
                      categories.includes('apk')
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-500 border-transparent'
                        : 'bg-black/30 border-white/10'
                    }`}
                  >
                    APK
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-gray-400">Bild hochladen</p>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="hidden"
                />
                {!image ? (
                  <motion.div
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.add('border-cyan-400', 'bg-cyan-400/10')
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove('border-cyan-400', 'bg-cyan-400/10')
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove('border-cyan-400', 'bg-cyan-400/10')
                      const droppedFile = e.dataTransfer.files[0]
                      if (droppedFile && droppedFile.type.startsWith('image/')) {
                        setImage(droppedFile)
                      } else {
                        toast.error('Bitte nur Bilddateien hochladen')
                      }
                    }}
                    onClick={() => imageInputRef.current?.click()}
                    className="w-full p-8 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:border-cyan-400/40 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer"
                  >
                    <div className="p-4 rounded-full bg-white/10">
                      <Upload size={32} className="text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-300 text-lg">Bild hier ablegen oder klicken</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP (max. 100MB)</p>
                    </div>
                  </motion.div>
                ) : (
                  <ImagePreview file={image} onRemove={() => setImage(null)} />
                )}
              </div>

              <div>
                <p className="mb-3 text-gray-400">Dateien / Programme / APKs / ZIPs (mehrere möglich)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || [])
                    setFiles(prev => [...prev, ...newFiles])
                  }}
                  className="hidden"
                />
                
                {files.length === 0 ? (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-5 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 hover:border-purple-400/40 hover:bg-white/10 transition-all flex items-center gap-4"
                  >
                    <div className="p-3 rounded-xl bg-white/10">
                      <FileArchive size={22} className="text-gray-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-300">Dateien auswählen</p>
                      <p className="text-xs text-gray-500 mt-0.5">EXE, APK, ZIP, PDF, ... (mehrere möglich)</p>
                    </div>
                    <div className="ml-auto">
                      <Upload size={18} className="text-gray-400" />
                    </div>
                  </motion.button>
                ) : (
                  <div className="space-y-3">
                    {files.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 rounded-xl border border-purple-400/40 bg-purple-400/10 flex items-center gap-3"
                      >
                        <div className="p-2 rounded-lg bg-purple-400/20">
                          <FileArchive size={18} className="text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-purple-400 truncate">{file.name}</p>
                          <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                        >
                          <X size={16} className="text-red-400" />
                        </button>
                      </motion.div>
                    ))}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-4 rounded-xl border border-dashed border-purple-400/40 bg-purple-400/5 hover:bg-purple-400/10 transition-all flex items-center justify-center gap-2 text-purple-400 font-semibold"
                    >
                      <Upload size={18} />
                      Weitere Dateien hinzufügen
                    </motion.button>
                  </div>
                )}
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

                  <div 
                    className="text-gray-400 mb-4 line-clamp-3 prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.description }}
                  />

                  <div className="mb-6 flex flex-wrap gap-2">
                    {post.category?.includes('program') && (
                      <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 text-sm">
                        💻 Programm
                      </span>
                    )}
                    {post.category?.includes('tutorial') && (
                      <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 text-sm">
                        📚 Tutorial
                      </span>
                    )}
                    {post.category?.includes('apk') && (
                      <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/30 text-sm">
                        📱 APK
                      </span>
                    )}
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
                      onClick={() => openDeleteModal(post)}
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