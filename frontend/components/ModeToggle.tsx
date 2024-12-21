"use client"
 
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { ActionIcon, Button, Menu } from "@mantine/core"
 
export default function ModeToggle() {
  const { setTheme } = useTheme()
 
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon variant="transparent" radius={100} size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item onClick={() => setTheme('light')}>Light</Menu.Item>
        <Menu.Item onClick={() => setTheme('dark')}>Dark</Menu.Item>
        <Menu.Item onClick={() => setTheme('system')}>System</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}