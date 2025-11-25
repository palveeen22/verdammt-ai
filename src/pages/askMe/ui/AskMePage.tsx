'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/shared/lib'
import { AskMeInput } from './AskMeInput'
import { AskMeMessageBubble } from './Message/MessageBubble'
import { AskMeHeader } from './AskMeHeader'
import { AskMeSelected } from './SelectedInput/AskMeSelected'

export interface TMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  attachments?: {
    type: 'image' | 'audio'
    url: string
    name?: string
  }[]
}

export const AskMePage = () => {
  const [messages, setMessages] = useState<TMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Halo! Saya Verdammt AI. Saya siap membantu Anda mencari produk yang Anda butuhkan. Anda bisa mengirim pesan text, foto, atau rekaman suara.',
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState<string>('')
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showAttachMenu, setShowAttachMenu] = useState<boolean>(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const isStoppingRef = useRef(false)

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputText.trim() && selectedFiles.length === 0) return

    const newMessage: TMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date(),
      attachments: selectedFiles.map(file => ({
        type: file.type.startsWith('image/') ? 'image' : 'audio',
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    }

    setMessages(prev => [...prev, newMessage])
    setInputText('')
    setSelectedFiles([])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: TMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Saya sedang memproses permintaan Anda. Mohon tunggu sebentar...',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const startRecording = async () => {
    // Prevent multiple start calls
    if (isRecording || mediaRecorderRef.current?.state === 'recording') {
      console.log('Already recording, ignoring start')
      return
    }

    try {
      console.log('Starting recording...')
      isStoppingRef.current = false // Reset stopping flag
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        console.log('Recording stopped (onstop callback)')
        isStoppingRef.current = false // Reset after stop completes
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' })
        setSelectedFiles(prev => [...prev, audioFile])
        stream.getTracks().forEach(track => track.stop())
        setIsRecording(false)
      }

      mediaRecorder.start()
      setIsRecording(true)
      console.log('Recording started, state set to true')
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Tidak dapat mengakses mikrofon. Pastikan izin mikrofon sudah diberikan.')
      setIsRecording(false)
      isStoppingRef.current = false
    }
  }

  const stopRecording = () => {
    console.log('Stop recording called, current state:', mediaRecorderRef.current?.state, 'isStopping:', isStoppingRef.current)

    // Guard: Prevent multiple stop calls
    if (isStoppingRef.current) {
      console.log('Already stopping, ignoring')
      return
    }

    // Guard: Don't stop if already stopped
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      console.log('Already stopped or no recorder')
      setIsRecording(false)
      return
    }

    // Guard: Only stop if actually recording
    if (mediaRecorderRef.current.state === 'recording') {
      console.log('Stopping MediaRecorder...')
      isStoppingRef.current = true // Mark as stopping
      mediaRecorderRef.current.stop()
    }

    setIsRecording(false)
    console.log('Recording state set to false')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(prev => [...prev, ...files])
    setShowAttachMenu(false)
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <AskMeHeader />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.type === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <AskMeMessageBubble
              message={message}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Selected Files Preview */}
      <AskMeSelected
        selectedFiles={selectedFiles}
        removeFile={removeFile}
      />

      {/* Input Container */}
      <AskMeInput
        showAttachMenu={showAttachMenu}
        inputText={inputText}
        setShowAttachMenu={setShowAttachMenu}
        fileInputRef={fileInputRef}
        setInputText={setInputText}
        handleKeyPress={handleKeyPress}
        startRecording={startRecording}
        stopRecording={stopRecording}
        isRecording={isRecording}
        handleSendMessage={handleSendMessage}
        handleFileSelect={handleFileSelect}
        selectedFiles={selectedFiles}
      />
    </div>
  )
}

// 'use client';

// import { useState } from 'react';
// import {
//   PenSquare,
//   GraduationCap,
//   Code2,
//   Coffee,
//   Lightbulb,
//   Plus,
//   Sparkles,
//   Clock,
//   ChevronDown,
//   ArrowUp
// } from 'lucide-react';

// type SuggestionCategory = 'write' | 'learn' | 'code' | 'life' | 'choice';

// interface Suggestion {
//   icon: React.ComponentType<{ className?: string }>;
//   label: string;
//   category: SuggestionCategory;
// }

// const suggestions: Suggestion[] = [
//   { icon: PenSquare, label: 'Write', category: 'write' },
//   { icon: GraduationCap, label: 'Learn', category: 'learn' },
//   { icon: Code2, label: 'Code', category: 'code' },
//   { icon: Coffee, label: 'Life stuff', category: 'life' },
//   { icon: Lightbulb, label: "Claude's choice", category: 'choice' },
// ];

// export const AskMePage = () => {
//   const [prompt, setPrompt] = useState('');
//   const [selectedModel, setSelectedModel] = useState('Sonnet 4.5');

//   const handleSubmit = () => {
//     if (prompt.trim()) {
//       console.log('Submitting prompt:', prompt);
//       // Handle submit logic here
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center p-4">
//       {/* Header */}
//       <div className="w-full max-w-4xl mb-12">
//         <div className="flex items-center gap-3 justify-center">
//           <div className="text-orange-500">
//             <svg
//               className="w-8 h-8"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//             >
//               <circle cx="12" cy="12" r="1.5" />
//               <circle cx="12" cy="6" r="1.5" />
//               <circle cx="12" cy="18" r="1.5" />
//               <circle cx="18" cy="12" r="1.5" />
//               <circle cx="6" cy="12" r="1.5" />
//               <circle cx="16.5" cy="7.5" r="1.5" />
//               <circle cx="7.5" cy="16.5" r="1.5" />
//               <circle cx="16.5" cy="16.5" r="1.5" />
//               <circle cx="7.5" cy="7.5" r="1.5" />
//             </svg>
//           </div>
//           <h1 className="text-4xl font-serif text-gray-200">
//             Evening, Alvin
//           </h1>
//         </div>
//       </div>

//       {/* Main Input Area */}
//       <div className="w-full max-w-4xl">
//         <div className="bg-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden">
//           {/* Textarea */}
//           <div className="p-6">
//             <textarea
//               value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="How can I help you today?"
//               className="w-full bg-transparent text-gray-300 placeholder-gray-500 text-lg resize-none focus:outline-none min-h-[120px]"
//               rows={4}
//             />
//           </div>

//           {/* Bottom Bar */}
//           <div className="px-6 pb-6 flex items-center justify-between">
//             {/* Left Actions */}
//             <div className="flex items-center gap-2">
//               <button
//                 className="p-2 hover:bg-[#3a3a3a] rounded-lg transition-colors"
//                 aria-label="Add attachment"
//               >
//                 <Plus className="w-5 h-5 text-gray-400" />
//               </button>
//               <button
//                 className="p-2 hover:bg-[#3a3a3a] rounded-lg transition-colors"
//                 aria-label="Use AI features"
//               >
//                 <Sparkles className="w-5 h-5 text-gray-400" />
//               </button>
//               <button
//                 className="p-2 hover:bg-[#3a3a3a] rounded-lg transition-colors"
//                 aria-label="View history"
//               >
//                 <Clock className="w-5 h-5 text-gray-400" />
//               </button>
//             </div>

//             {/* Right Actions */}
//             <div className="flex items-center gap-3">
//               {/* Model Selector */}
//               <button className="flex items-center gap-2 px-4 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-lg transition-colors">
//                 <span className="text-sm text-gray-300">{selectedModel}</span>
//                 <ChevronDown className="w-4 h-4 text-gray-400" />
//               </button>

//               {/* Submit Button */}
//               <button
//                 onClick={handleSubmit}
//                 disabled={!prompt.trim()}
//                 className="p-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
//                 aria-label="Send message"
//               >
//                 <ArrowUp className="w-5 h-5 text-white" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Suggestion Pills */}
//         <div className="flex items-center justify-center gap-3 mt-6">
//           {suggestions.map((suggestion) => {
//             const Icon = suggestion.icon;
//             return (
//               <button
//                 key={suggestion.category}
//                 className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full transition-colors border border-gray-700 hover:border-gray-600"
//               >
//                 <Icon className="w-4 h-4 text-gray-400" />
//                 <span className="text-sm text-gray-300">{suggestion.label}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }