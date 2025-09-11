import React from 'react'
import ThemeToggleButton from '../hooks/useTheme'

const Footer = () => {
  return (
    <footer className="mx-auto mt-auto w-full max-w-screen-sm border-t border-gray-300 dark:border-[#2A2A28] px-4 ">
    <div
      className="flex items-center justify-between px-0 pt-4 md:px-0"
      style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
    >
      <p className="text-sm text-gray-200 dark:text-gray-100 font-medium">
        © 2025 Cajaun Campbell
      </p>
      <ThemeToggleButton />
    </div>
  </footer>
  )
}

export default Footer