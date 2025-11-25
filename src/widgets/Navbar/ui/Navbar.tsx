'use client'

import { ThemeSwitcher } from "@/shared/ui"
import { NavTitle } from "../model"

export const Navbar = () => {
  return (
    <div className="border-b border-dashed border-border p-4 flex justify-between items-center gap-2">
      <h1 className="text-xl font-semibold text-foreground font-knewave">
        {NavTitle}
      </h1>
      <ThemeSwitcher/>
    </div>
  )
}