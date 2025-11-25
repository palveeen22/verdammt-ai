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