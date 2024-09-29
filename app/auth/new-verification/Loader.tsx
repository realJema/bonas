import React from 'react'
import { CheckCircle } from 'lucide-react'

interface FullScreenLoaderProps {
  message?: string
}

export default function FullScreenLoader({ message = "Verifying your account..." }: FullScreenLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 border-8 border-green-200 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 border-4 border-green-400 rounded-full animate-spin"></div>
          <div className="absolute inset-4 border-2 border-green-600 rounded-full animate-ping"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-bold text-green-700">{message}</h2>
        <p className="mt-2 text-gray-600 max-w-sm mx-auto">This may take a few moments. Please don&apos;t refresh this page.</p>
      </div>
      <div className="mt-16">
        <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-100">
        <div className="h-full bg-green-500 animate-progress"></div>
      </div>
    </div>
  )
}