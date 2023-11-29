// import { useModal } from '@/hooks/useModal'
// import { useToast } from '@/hooks/useToast'
// import { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react'
// import { useTranslation } from 'react-i18next'
import AWS from 'aws-sdk'
import { useEffect, useState } from 'react'

// import colors from 'tailwindcss/colors'

// interface FileWithType extends File {
//   type: string
// }

export function Upload() {
  //   const [files, setFiles] = useState<FileWithType[]>([])
  //   const fileInputRef = useRef<HTMLInputElement>(null)

  const [folders, setFolders] = useState<string[]>([])
  const [subFolders, setSubFolders] = useState<string[]>([])

  //   const { t } = useTranslation()

  //   const { showToast } = useToast()

  //   const { openModal } = useModal()

  //   function handleDrop(e: DragEvent<HTMLDivElement>) {
  //     e.preventDefault()
  //     const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
  //       ['image/jpg', 'image/jpeg', 'image/png', 'audio/mpeg'].includes(
  //         file.type,
  //       ),
  //     ) as FileWithType[]

  //     if (newFiles.length === 0) {
  //       showToast('Tipo de arquivo não suportado!', {
  //         type: 'error',
  //         theme: 'colored',
  //       })
  //     } else {
  //       setFiles((prevFiles) => [...prevFiles, ...newFiles])
  //     }
  //   }

  //   function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
  //     const newFiles = Array.from(e.target.files || []).filter((file) =>
  //       ['image/jpg', 'image/jpeg', 'image/png', 'audio/mpeg'].includes(
  //         file.type,
  //       ),
  //     ) as FileWithType[]
  //     setFiles((prevFiles) => [...prevFiles, ...newFiles])
  //   }

  //   function handleOpenFileExplorer() {
  //     fileInputRef.current?.click()
  //   }

  //   function handleClickableArea() {
  //     handleOpenFileExplorer()
  //   }

  //   function handleRemoveFile(index: number) {
  //     setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  //   }

  //   function formatBytes(bytes: number) {
  //     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  //     if (bytes === 0) return '0 Byte'
  //     const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))))
  //     return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
  //   }

  //   function formatDate(timestamp: number) {
  //     const date = new Date(timestamp)
  //     const options: Intl.DateTimeFormatOptions = {
  //       day: 'numeric',
  //       month: 'short',
  //       year: 'numeric',
  //     }
  //     return date.toLocaleDateString('pt-br', options)
  //   }

  //   const [folders, setFolders] = useState<string[]>([])
  const [selectedFolder, setSelectedFolder] = useState('')

  const fetchS3Folders = async (prefix = '') => {
    const s3 = new AWS.S3()
    const bucketName = 'sonoriza-media'

    const params = {
      Bucket: bucketName,
      Delimiter: '/',
      Prefix: prefix,
    }

    try {
      const response = await s3.listObjectsV2(params).promise()

      // Coleta os prefixes (pastas) da resposta
      const newFolders =
        response.CommonPrefixes?.map((commonPrefix) => commonPrefix.Prefix) ||
        []
      return newFolders as string[]
    } catch (error) {
      console.error('Erro ao listar pastas:', error)
      return []
    }
  }

  const handleFolderClick = async (folder: string) => {
    // Verifica se já carregamos as subpastas dessa pasta
    if (!folders.includes(folder)) {
      const subFolders = await fetchS3Folders(folder)
      setFolders((prevFolders) => [...prevFolders, folder, ...subFolders])
    }

    // Atualiza o estado para a pasta selecionada
    setSelectedFolder(folder)
  }

  const handleGetArchives = () => {
    // Inicialmente, carrega as pastas principais
    fetchS3Folders()
      .then((initialFolders) => {
        console.log(initialFolders)
        setFolders(initialFolders)
      })
      .catch((error) =>
        console.error('Erro ao carregar pastas principais:', error),
      )
  }

  useEffect(() => {
    handleGetArchives()
  }, [])

  return (
    <div>
      {/* {files.length > 0 && (
        <div>
          <div className="h-[1px] bg-gray-300/50 my-7" />
          <ul>
            {files.map((file, index) => (
              <li
                key={index}
                className="h-[71px] rounded border-2 border-dashed border-purple-600 px-4 py-3 mt-4 flex items-center"
              >
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-12 h-12 mr-2 rounded-full"
                  />
                ) : (
                  <IoMusicalNoteSharp color={colors.gray[700]} size={48} />
                )}

                <div className="ml-2">
                  <p className="font-medium text-sm">{file.name}</p>
                  <span className="text-[#71839B] text-xs font-normal">
                    {formatBytes(file.size)} - {formatDate(file.lastModified)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    openModal({
                      title: t('modal.title'),
                      description: t('modal.description'),
                      confirm() {
                        handleRemoveFile(index)
                      },
                    })
                  }}
                  className="ml-auto hove"
                >
                  <IoTrash color={colors.red[600]} size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )} */}

      <div className="h-[1px] bg-gray-300/50 my-7" />

      <div className="flex flex-col items-start">
        {folders.map((item) => (
          <button key={item} onClick={() => handleFolderClick(item)}>
            {item === selectedFolder ? <strong>{item}</strong> : item}
          </button>
        ))}
      </div>

      {/* <div
        className="drop-archives"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={handleClickableArea}
      >
        <div className="text-center">
          <p
            className="font-normal text-[13px] text-[#404554]"
            dangerouslySetInnerHTML={{ __html: t('attachFile.info') }}
          />
          <span className="font-normal text-xs text-[#9EA1B0]">
            {t('attachFile.description')}
          </span>
        </div>
        <div className="border p-1 border-blue-400 rounded-full">
          <IoArrowBack />
          <input
            type="file"
            accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileInputChange}
          />
        </div>
      </div> */}
    </div>
  )
}
