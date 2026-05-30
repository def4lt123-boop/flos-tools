'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'

type ImagePreviewProps = {
  file: File | null
  onRemove: () => void
}

export default function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  if (!file) return null

  const imageUrl = URL.createObjectURL(file)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative rounded-2xl overflow-hidden border border-cyan-400/30 bg-cyan-400/5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Preview"
        className="w-full h-64 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onRemove}
        className="absolute top-4 right-4 p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
      >
        <X size={20} />
      </motion.button>

      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-sm font-semibold text-white mb-1">{file.name}</p>
        <p className="text-xs text-gray-300">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </motion.div>
  )
}