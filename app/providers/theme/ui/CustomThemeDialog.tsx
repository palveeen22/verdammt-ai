'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { Input } from '@/shared/ui/input'
import { useThemeStore } from '../model/useThemeStore'

interface CustomThemeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomThemeDialog({ open, onOpenChange }: CustomThemeDialogProps) {
  const { customTheme, setCustomTheme, setMode, resetCustomTheme } = useThemeStore()
  const [tempTheme, setTempTheme] = useState(customTheme)

  const handleSave = () => {
    setCustomTheme(tempTheme)
    setMode('custom')
    onOpenChange(false)
  }

  const handleReset = () => {
    resetCustomTheme()
    setTempTheme(useThemeStore.getState().customTheme)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize Your Theme</DialogTitle>
          <DialogDescription>
            Pick your favorite colors to personalize your experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="primary" className="text-right">
              Primary
            </Label>
            <Input
              id="primary"
              type="color"
              value={tempTheme.primary}
              onChange={(e) => setTempTheme({ ...tempTheme, primary: e.target.value })}
              className="col-span-3 h-10"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="secondary" className="text-right">
              Secondary
            </Label>
            <Input
              id="secondary"
              type="color"
              value={tempTheme.secondary}
              onChange={(e) => setTempTheme({ ...tempTheme, secondary: e.target.value })}
              className="col-span-3 h-10"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="background" className="text-right">
              Background
            </Label>
            <Input
              id="background"
              type="color"
              value={tempTheme.background}
              onChange={(e) => setTempTheme({ ...tempTheme, background: e.target.value })}
              className="col-span-3 h-10"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="foreground" className="text-right">
              Text
            </Label>
            <Input
              id="foreground"
              type="color"
              value={tempTheme.foreground}
              onChange={(e) => setTempTheme({ ...tempTheme, foreground: e.target.value })}
              className="col-span-3 h-10"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accent" className="text-right">
              Accent
            </Label>
            <Input
              id="accent"
              type="color"
              value={tempTheme.accent}
              onChange={(e) => setTempTheme({ ...tempTheme, accent: e.target.value })}
              className="col-span-3 h-10"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
          <Button onClick={handleSave}>Apply Theme</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}