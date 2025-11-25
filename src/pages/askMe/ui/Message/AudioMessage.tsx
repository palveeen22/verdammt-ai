'use client'

import { Play, Pause } from 'lucide-react'
import { useState, useRef, useMemo } from 'react'

type AudioMessageProps = {
  url: string
  isUserMessage?: boolean
}

export const AudioMessage = ({ url, isUserMessage = false }: AudioMessageProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Generate waveform heights once - fixes impure function error
  const waveformHeights = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    return Array.from({ length: 40 }, () => Math.random() * 100)
  }, [])

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={`w-64 h-16 rounded-lg flex items-center gap-3 px-3 ${
      isUserMessage ? 'bg-white/10' : 'bg-black/20'
    }`}>
      <audio
        ref={audioRef}
        src={url || undefined}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          isUserMessage 
            ? 'bg-black/20 hover:bg-black/30' 
            : 'bg-white/10 hover:bg-white/20'
        }`}
      >
        {isPlaying ? (
          <Pause className={`w-5 h-5 fill-current ${
            isUserMessage ? 'text-black' : 'text-white'
          }`} />
        ) : (
          <Play className={`w-5 h-5 fill-current ml-0.5 ${
            isUserMessage ? 'text-black' : 'text-white'
          }`} />
        )}
      </button>

      {/* Waveform & Time */}
      <div className="flex-1 flex flex-col gap-1">
        {/* Waveform Visualization */}
        <div className="relative h-6 flex items-center gap-0.5">
          {waveformHeights.map((height, i) => {
            const isPassed = (i / 40) * 100 < progress
            return (
              <div
                key={i}
                className={`w-0.5 rounded-full transition-colors ${
                  isPassed 
                    ? (isUserMessage ? 'bg-muted' : 'bg-blue-500')
                    : (isUserMessage ? 'bg-muted-foreground/40' : 'bg-white/30')
                }`}
                style={{ 
                  height: `${height}%`,
                  minHeight: '20%'
                }}
              />
            )
          })}
        </div>

        {/* Time Display */}
        <div className={`flex justify-between text-xs ${
          isUserMessage ? 'text-black/60' : 'text-white/60'
        }`}>
          <span>{formatTime(isPlaying ? currentTime :  duration)}</span>
        </div>
      </div>
    </div>
  )
}