'use client'

import React, { Component, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050816] text-white flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full rounded-3xl border border-red-500/30 bg-red-500/5 backdrop-blur-xl p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6"
            >
              <AlertTriangle size={40} className="text-red-400" />
            </motion.div>

            <h1 className="text-4xl font-black mb-4">
              Oops! Etwas ist schiefgelaufen
            </h1>

            <p className="text-gray-400 mb-8 text-lg">
              Ein unerwarteter Fehler ist aufgetreten. Bitte versuche die Seite neu zu laden.
            </p>

            {this.state.error && (
              <div className="mb-8 p-4 rounded-xl bg-black/30 border border-white/10 text-left">
                <p className="text-sm text-red-400 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 text-xl font-bold"
            >
              <RefreshCw size={24} />
              Seite neu laden
            </motion.button>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}