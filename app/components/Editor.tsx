'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlock from '@tiptap/extension-code-block'
import HardBreak from '@tiptap/extension-hard-break'
import History from '@tiptap/extension-history'
import Placeholder from '@tiptap/extension-placeholder'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Strikethrough,
  Code as CodeIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Code2
} from 'lucide-react'

type EditorProps = {
  content: string
  onChange: (content: string) => void
}

export default function Editor({ content, onChange }: EditorProps) {

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      Code,
      Heading.configure({
        levels: [1, 2, 3]
      }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
      HardBreak,
      History,
      Placeholder.configure({
        placeholder: 'Schreibe hier deinen Beitrag... Unterstützt Fett, Kursiv, Code, Listen und mehr!'
      })
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none min-h-[400px] p-5 outline-none prose-headings:text-white prose-p:text-gray-300 prose-code:text-cyan-400 prose-code:bg-cyan-400/10 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-strong:text-white prose-em:text-gray-200 prose-ul:text-gray-300 prose-ol:text-gray-300 prose-li:text-gray-300 prose-blockquote:text-gray-300 prose-blockquote:border-cyan-400'
      },
      handleKeyDown: (view, event) => {
        // Ctrl+S or Cmd+S to trigger save (prevent default browser save)
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
          event.preventDefault()
          // Dispatch custom event that parent can listen to
          window.dispatchEvent(new CustomEvent('editor-save'))
          return true
        }
        return false
      }
    }
  })

  // Update editor content when prop changes (for editing)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return null
  }

  const buttons = [
    {
      icon: BoldIcon,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      title: 'Fett (Ctrl+B)'
    },
    {
      icon: ItalicIcon,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      title: 'Kursiv (Ctrl+I)'
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive('strike'),
      title: 'Durchgestrichen'
    },
    {
      icon: CodeIcon,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive('code'),
      title: 'Inline Code'
    },
    {
      type: 'separator' as const
    },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      title: 'Überschrift 1'
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      title: 'Überschrift 2'
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      title: 'Überschrift 3'
    },
    {
      type: 'separator' as const
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      title: 'Aufzählung'
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      title: 'Nummerierte Liste'
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      title: 'Zitat'
    },
    {
      icon: Code2,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
      title: 'Code Block'
    },
    {
      type: 'separator' as const
    },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      title: 'Rückgängig (Ctrl+Z)',
      disabled: !editor.can().undo()
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      title: 'Wiederholen (Ctrl+Y)',
      disabled: !editor.can().redo()
    }
  ]

  return (
    <div className="rounded-2xl bg-black/30 border border-white/10 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white/10 bg-white/5">
        {buttons.map((button, index) => {
          if (button.type === 'separator') {
            return (
              <div key={index} className="w-px h-6 bg-white/20 mx-2" />
            )
          }

          return (
            <motion.button
              key={index}
              type="button"
              whileHover={{ scale: button.disabled ? 1 : 1.05 }}
              whileTap={{ scale: button.disabled ? 1 : 0.95 }}
              onClick={button.action}
              title={button.title}
              disabled={button.disabled}
              className={`p-2.5 rounded-xl transition-all ${
                button.disabled
                  ? 'opacity-30 cursor-not-allowed'
                  : button.isActive
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <button.icon size={18} />
            </motion.button>
          )
        })}
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}