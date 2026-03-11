import { useToast } from '@/hooks/useToast'
import { Dispatch, SetStateAction } from 'react'

export interface FileWithType extends File {
  type: string
}

export interface CreatePasteFormProps {
  folderName: string
}

export function useUpload() {
  const { showToast } = useToast()

  const copyObjectUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      showToast('Text copied to clipboard', {
        type: 'success',
        theme: 'light',
      })
    } catch (err) {
      showToast('Error copying to clipboard', {
        type: 'warning',
        theme: 'light',
      })
    }
  }

  function removeUploadFile(
    index: number,
    setFiles: Dispatch<SetStateAction<FileWithType[]>>,
  ) {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  function formatBytes(bytes: number) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Byte'
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
  }

  function formatDate(timestamp: number) {
    const date = new Date(timestamp)
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
    return date.toLocaleDateString('pt-br', options)
  }

  return {
    copyObjectUrl,
    formatBytes,
    formatDate,
    removeUploadFile,
  }
}
