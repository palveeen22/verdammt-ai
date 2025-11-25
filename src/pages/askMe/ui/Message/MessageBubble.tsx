import { cn } from '@/shared/lib'
import Image from 'next/image'
import React from 'react'
import { TMessage } from '../AskMePage'
import { AudioMessage } from './AudioMessage'

export const AskMeMessageBubble = ({ message }: { message: TMessage }) => {
  return (
    <div
      className={cn(
        'max-w-[80%] rounded-2xl px-4 py-3',
        message.type === 'user'
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary text-secondary-foreground'
      )}
    >
      {/* Attachments */}
      {message.attachments && message.attachments.length > 0 && (
        <div className="mb-2 space-y-2">
          {message.attachments.map((attachment, idx) => (
            <div key={idx}>
              {attachment.type === 'image' && (
                <div className="relative w-full rounded-lg overflow-hidden">
                  <Image
                    src={attachment.url}
                    alt="attachment"
                    width={400}
                    height={300}
                    className="rounded-lg w-full h-auto"
                    unoptimized
                  />
                </div>
              )}
              {attachment.type === 'audio' && (
                <AudioMessage
                  url={attachment.url} 
                  isUserMessage={message.type === 'user'}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Message Content */}
      {message.content && (
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      )}

      {/* Timestamp */}
      <span
        className={cn(
          'text-xs mt-1 flex opacity-70',
          message.type === 'user' ? 'justify-end' : 'justify-start'
        )}
      >
        {message.timestamp.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
  )
}