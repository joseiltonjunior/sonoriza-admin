import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react'
import arrow from '@/assets/arrow.svg'
import trash from '@/assets/trash.svg'

import doc from '@/assets/doc.png'
import pdf from '@/assets/pdf.png'
import png from '@/assets/png.png'

interface FileWithType extends File {
  type: string
}

interface AttachFileProps {
  check?: React.Dispatch<React.SetStateAction<boolean>>
}

export function AttachFile({ check }: AttachFileProps) {
  const [files, setFiles] = useState<FileWithType[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
      [
        'application/pdf',
        'application/msword',
        'image/jpeg',
        'image/png',
        'application/vnd.ms-excel',
      ].includes(file.type),
    ) as FileWithType[]
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files || []).filter((file) =>
      [
        'application/pdf',
        'application/msword',
        'image/jpeg',
        'image/png',
        'application/vnd.ms-excel',
      ].includes(file.type),
    ) as FileWithType[]
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
  }

  function handleOpenFileExplorer() {
    fileInputRef.current?.click()
  }

  function handleClickableArea() {
    handleOpenFileExplorer()
  }

  function handleRemoveFile(index: number) {
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

  function getFileIcon(type: string) {
    if (type.startsWith('image/')) {
      return png
    } else if (type === 'application/pdf') {
      return pdf
    } else {
      return doc
    }
  }

  useEffect(() => {
    if (files.length > 0 && check) {
      check(true)
    }
  }, [check, files.length])

  return (
    <div className="max-w-[427px] md:max-w-full">
      <div>
        <h1 className="font-bold text-lg">Anexar arquivos</h1>
        <div className="bg-green-400 rounded-3xl h-1 w-6" />

        {files.length > 0 && (
          <div className="mt-4">
            <ul>
              {files.map((file, index) => (
                <li
                  key={index}
                  className="h-[71px] rounded border-2 border-dashed border-blue-600 px-4 py-3 mt-4 flex items-center"
                >
                  <img
                    src={getFileIcon(file.type)}
                    alt="icon type"
                    className="w-8 h-8"
                  />

                  <div className="ml-2">
                    <p className="font-medium text-sm">{file.name}</p>
                    <span className="text-[#71839B] text-xs font-normal">
                      {formatBytes(file.size)} - {formatDate(file.lastModified)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="ml-auto"
                  >
                    <img src={trash} alt="remove item" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          className="h-[71px] rounded border-dashed border-2 border-blue-600 px-4 py-3 mt-4 flex items-center justify-between cursor-pointer hover:border-blue-600/60"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={handleClickableArea}
        >
          <div className="text-center">
            <p className="font-normal text-[13px] text-[#404554]">
              Arraste para dentro ou{' '}
              <strong className="text-blue-600">clique</strong> para selecionar
              um arquivo
            </p>
            <span className="font-normal text-xs text-[#9EA1B0]">
              Formatos suportados: PDF, Word, JPG, XLS e PNG
            </span>
          </div>
          <div className="border p-1 border-blue-400 rounded-full">
            <img src={arrow} alt="" />
            <input
              type="file"
              accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
