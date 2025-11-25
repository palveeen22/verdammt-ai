import { SidebarTrigger, ThemeSwitcher } from "@/shared/ui"

export const AskMeHeader = () => {
  return (
    <div className="border-b border-dashed border-border p-4 flex justify-between items-center gap-2">
      <SidebarTrigger />
      <h1 className="text-xl font-semibold text-foreground font-knewave">
        Verdammt Ai.
      </h1>
      <ThemeSwitcher />
    </div>
  )
}