'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

type DeleteModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
}

export default function DeleteModal({ isOpen, onClose, onConfirm, title }: DeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="w-full max-w-md rounded-3xl border border-red-500/30 bg-gradient-to-b from-red-500/10 to-black/50 backdrop-blur-xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="mb-6 p-4 rounded-full bg-red-500/20 border border-red-500/30"
              >
                <AlertTriangle size={48} className="text-red-400" />
              </motion.div>

              <h2 className="text-3xl font-black mb-3">
                Post löschen?
              </h2>

              <p className="text-gray-400 mb-2">
                Möchtest du wirklich den Post
              </p>
              <p className="text-xl font-bold text-white mb-6">
                "{title}"
              </p>
              <p className="text-gray-400 mb-8">
                löschen? Diese Aktion kann nicht rückgängig gemacht werden.
              </p>

              <div className="flex gap-4 w-full">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 font-bold transition-colors"
                >
                  Abbrechen
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onConfirm()
                    onClose()
                  }}
                  className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 font-bold hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Löschen
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}