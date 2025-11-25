'use client'

import { Play, Pause, X } from 'lucide-react'
import { useState, useRef, useMemo, useEffect } from 'react'


export const AudioPreview = ({ file, onRemove }: { file: File; onRemove: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioUrl, setAudioUrl] = useState<string>('')

  // Generate waveform heights once on mount - fixes impure function error
  const waveformHeights = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    return Array.from({ length: 40 }, () => Math.random() * 100)
  }, [])

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setAudioUrl(url)
    
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

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

  // Don't render until audioUrl is ready - fixes empty src error
  if (!audioUrl) {
    return (
      <div className="relative w-64 h-16 bg-secondary rounded-lg flex items-center justify-center border border-border">
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    )
  }

  return (
    <div className="relative w-64 h-16 bg-secondary rounded-lg flex items-center gap-3 px-3 border border-border">
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center shrink-0 transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-foreground fill-foreground" />
        ) : (
          <Play className="w-5 h-5 text-foreground fill-foreground ml-0.5" />
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
                  isPassed ? 'bg-muted' : 'bg-muted-foreground/40'
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
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(isPlaying ? currentTime: duration)}</span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="absolute top-1 -right-2 bg-destructive rounded-full p-1 hover:bg-destructive/90 transition-colors shadow-lg"
      >
        <X className="w-3 h-3 text-white" />
      </button>
    </div>
  )
}