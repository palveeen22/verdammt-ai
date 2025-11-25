'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { AudioPreview } from './AudioPreview'

type TProps = {
  selectedFiles: File[]
  removeFile: (index: number) => void
}

export const AskMeSelected = ({
  selectedFiles,
  removeFile
}: TProps) => {
  return (
    <>
      {selectedFiles.length > 0 && (
        <div className="px-4 py-2 border-t border-dashed border-border bg-muted/50">
          <div className="flex gap-2 overflow-x-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative shrink-0">
                {file.type.startsWith('image/') ? (
                  <div className="relative">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg border border-border"
                      unoptimized
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-0 -right-2 bg-destructive rounded-full p-1 hover:bg-destructive/90 transition-colors shadow-lg"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <AudioPreview
                    file={file}
                    onRemove={() => removeFile(index)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}