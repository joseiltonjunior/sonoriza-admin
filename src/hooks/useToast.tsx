import { toast, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useCallback } from 'react'

export function useToast() {
  const showToast = useCallback((message: string, options?: ToastOptions) => {
    toast(message, options)
  }, [])

  return { showToast }
}
