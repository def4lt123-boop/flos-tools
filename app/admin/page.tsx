'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminPage() {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [apk, setApk] = useState<File | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  async function uploadPost() {

    try {

      setLoading(true)

      if (!title || !description || !apk || !image) {
        toast.error('Bitte alles ausfüllen')
        return
      }

      const apkName = `${Date.now()}-${apk.name}`
      const imageName = `${Date.now()}-${image.name}`

      console.log('Uploading APK...')
      
      const apkUpload = await supabase.storage
        .from('apks')
        .upload(apkName, apk)

      if (apkUpload.error) {
        console.error(apkUpload.error)
        toast.error(apkUpload.error.message)
        return
      }

      console.log('Uploading Image...')

      const imageUpload = await supabase.storage
        .from('apks')
        .upload(imageName, image)

      if (imageUpload.error) {
        console.error(imageUpload.error)
        toast.error(imageUpload.error.message)
        return
      }

      const apkUrl = supabase.storage
        .from('apks')
        .getPublicUrl(apkName)

      const imageUrl = supabase.storage
        .from('apks')
        .getPublicUrl(imageName)

      console.log('Saving Post...')

      const insertPost = await supabase
        .from('posts')
        .insert({
          title,
          description,
          apk_url: apkUrl.data.publicUrl,
          image_url: imageUrl.data.publicUrl
        })

      if (insertPost.error) {
        console.error(insertPost.error)
        toast.error(insertPost.error.message)
        return
      }

      toast.success('Post erstellt')

      setTitle('')
      setDescription('')
      setApk(null)
      setImage(null)

    } catch (err) {

      console.error(err)
      toast.error('Fehler beim Upload')

    } finally {

      setLoading(false)

    }
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-6">

      <Toaster />

      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

        <h1 className="text-5xl font-black mb-10">
          Admin Dashboard
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 outline-none"
          />

          <textarea
            placeholder="Beschreibung"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-2xl bg-white/10 h-40 outline-none"
          />

          <div>
            <p className="mb-2 text-gray-400">
              APK Datei
            </p>

            <input
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setApk(e.target.files[0])
                }
              }}
            />
          </div>

          <div>
            <p className="mb-2 text-gray-400">
              Bild
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImage(e.target.files[0])
                }
              }}
            />
          </div>

          <div
  onClick={uploadPost}
  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 font-bold text-lg hover:opacity-90 transition text-center cursor-pointer select-none"
>
  {loading ? 'Upload läuft...' : 'Post veröffentlichen'}
</div>

        </div>

      </div>

    </main>
  )
}