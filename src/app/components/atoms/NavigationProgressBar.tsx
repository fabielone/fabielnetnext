'use client'
import { motion } from 'framer-motion'

interface NavigationProgressBarProps {
  isVisible: boolean
}

export const NavigationProgressBar = ({ isVisible }: NavigationProgressBarProps) => {
  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] h-1">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
        initial={{ width: '0%' }}
        animate={{ 
          width: ['0%', '70%', '100%'],
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          times: [0, 0.7, 1]
        }}
      />
    </div>
  )
}
