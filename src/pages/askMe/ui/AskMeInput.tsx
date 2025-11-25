'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/shared/lib'
import { AudioLines, ImageIcon, Plus, Send } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui'

type TProps = {
  showAttachMenu: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  setShowAttachMenu: (value: React.SetStateAction<boolean>) => void
  inputText: string
  setInputText: (value: React.SetStateAction<string>) => void
  handleKeyPress: (e: React.KeyboardEvent) => void
  startRecording: () => Promise<void>
  stopRecording: () => void
  isRecording: boolean
  handleSendMessage: () => void
  selectedFiles: File[]
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const AskMeInput = ({
  showAttachMenu,
  inputText,
  setShowAttachMenu,
  fileInputRef,
  setInputText,
  handleKeyPress,
  startRecording,
  stopRecording,
  isRecording,
  handleSendMessage,
  handleFileSelect,
  selectedFiles
}: TProps) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Cek apakah klik di luar menu DAN di luar button
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowAttachMenu(false)
      }
    }

    // Add event listener saat menu terbuka
    if (showAttachMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAttachMenu, setShowAttachMenu])

  return (
    <>
      {/* Input Container */}
      <div className="p-4 border-t border-dashed border-border bg-background">
        <div className="flex items-end gap-2">
          {/* Plus Button with Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors shrink-0"
              >
                <Plus className="w-6 h-6 text-secondary-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              {/* Attach Menu */}

              <DropdownMenuItem
                onClick={() => {
                  fileInputRef.current?.click()
                  setShowAttachMenu(false)
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left whitespace-nowrap"
              >
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm">Upload Foto</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Text Input with Voice Button Inside */}
          <div className="flex-1 bg-muted rounded-full px-4 py-3 flex items-center gap-3 border border-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send a message..."
              className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm"
            />

            {/* Voice Button Inside Input */}
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={cn(
                'shrink-0 flex items-center justify-center transition-all',
                isRecording ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isRecording ? (
                <div className="flex items-center justify-center gap-0.5 h-5 w-5">
                  <span className="w-0.5 bg-primary rounded-full animate-music-bar-1" style={{ height: '10%' }} />
                  <span className="w-0.5 bg-primary rounded-full animate-music-bar-2" style={{ height: '40%' }} />
                  <span className="w-0.5 bg-primary rounded-full animate-music-bar-3" style={{ height: '60%' }} />
                  <span className="w-0.5 bg-primary rounded-full animate-music-bar-1" style={{ height: '20%' }} />
                  <span className="w-0.5 bg-primary rounded-full animate-music-bar-3" style={{ height: '10%' }} />
                </div>
              ) : (
                <AudioLines className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() && selectedFiles.length === 0}
            className="w-11 h-11 rounded-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed transition-colors flex items-center justify-center shrink-0"
          >
            <Send className={cn(
              'w-5 h-5',
              inputText.trim() || selectedFiles.length > 0 ? 'text-primary-foreground' : 'text-muted-foreground'
            )} />
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </>
  )
};