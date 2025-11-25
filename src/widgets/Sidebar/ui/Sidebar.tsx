'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/shared/ui'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/shared/ui/sidebar'
import {
  MessageSquare,
  User,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { menuItems, settingsItems } from '../model/menu'
import { Button } from '@/shared/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

const recentChats = [
  { id: '1', title: 'Chat about React', icon: '💬' },
  { id: '2', title: 'TypeScript Help', icon: '📘' },
  { id: '3', title: 'UI Design Tips', icon: '🎨' },
]

// Animation variants
const fadeSlideVariants = {
  hidden: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.15 }
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, delay: 0.05 }
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.15 }
  }
}

const scaleVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.15 }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.15 }
  }
}

export function SidebarComponent() {
  const { open } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="border-b border-dashed border-border p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <AnimatePresence mode="wait">
              {open && (
                <motion.span
                  initial={{ opacity: 0, x: -20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: 'auto' }}
                  exit={{ opacity: 0, x: -20, width: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="text-lg font-semibold font-knewave text-foreground whitespace-nowrap"
                >
                  Verdammt AI
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Main Menu */}
        <SidebarGroup>
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                variants={fadeSlideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <SidebarGroupLabel>Menu</SidebarGroupLabel>
              </motion.div>
            )}
          </AnimatePresence>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <AnimatePresence mode="wait">
                        {open && (
                          <motion.span
                            variants={fadeSlideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{
                              duration: 0.2,
                              delay: 0.05 + (index * 0.02) // Stagger animation
                            }}
                            className="whitespace-nowrap"
                          >
                            {item.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Chats */}
        <SidebarGroup>
          <AnimatePresence mode="wait">
            {open && (
              <motion.div
                variants={fadeSlideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
              </motion.div>
            )}
          </AnimatePresence>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentChats.map((chat, index) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild tooltip={chat.title}>
                    <Link href={`/chat/${chat.id}`} className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      <AnimatePresence mode="wait">
                        {open && (
                          <motion.span
                            variants={fadeSlideVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{
                              duration: 0.2,
                              delay: 0.05 + (index * 0.02) // Stagger animation
                            }}
                            className="whitespace-nowrap truncate flex-1"
                          >
                            {chat.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="expanded-footer"
              variants={fadeSlideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-2"
            >
              {/* Full Footer */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex justify-start items-center gap-2 w-full hover:bg-card rounded-lg p-2 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col justify-start items-start">
                      <span className="text-sm font-medium text-foreground truncate">
                        John Doe
                      </span>
                      <span className="text-xs text-accent truncate w-full">
                        john@example.com
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {settingsItems.map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                      <Link href={item.url} className="flex items-center gap-2 cursor-pointer">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-footer"
              variants={scaleVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center gap-2"
            >
              {/* Collapsed Footer - Icon Only */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-medium">John Doe</span>
                      <span className="text-xs text-muted-foreground">john@example.com</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  {settingsItems.map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                      <Link href={item.url} className="flex items-center gap-2 cursor-pointer">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
          )}
        </AnimatePresence>
      </SidebarFooter>
    </Sidebar>
  )
}