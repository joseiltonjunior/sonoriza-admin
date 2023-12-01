import { useModal } from '@/hooks/useModal'
import { useToast } from '@/hooks/useToast'
import { Dispatch, DragEvent, SetStateAction, useState } from 'react'
import AWS, { Lambda } from 'aws-sdk'
import { ListenObject } from '../components/Upload/ListenObject'

export interface FileWithType extends File {
  type: string
}

interface SelectedPasteProps {
  folder: string
  setFolderItems?: Dispatch<SetStateAction<string[]>>
  setSubFolders?: Dispatch<SetStateAction<string[]>>
}

interface UploadObjectProps {
  type: 'artists' | 'musics'
  files: FileWithType[]
  selectedFolder: string
  subFolders?: string[]
  isArtist?: string
  setFiles: Dispatch<SetStateAction<FileWithType[]>>
  setFolderItems?: Dispatch<SetStateAction<string[]>>
  setSubFolders?: Dispatch<SetStateAction<string[]>>
}

export interface CreatePasteFormProps {
  folderName: string
}

interface CreatePasteProps extends CreatePasteFormProps {
  selectedFolder: string
}

export function useUpload() {
  const { openModal } = useModal()
  const { showToast } = useToast()

  const [isLoading, setIsLoading] = useState(false)

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

      const newFolders =
        response.CommonPrefixes?.map((commonPrefix) => commonPrefix.Prefix) ||
        []
      return newFolders as string[]
    } catch (error) {
      showToast('Error to list paste', {
        type: 'error',
        theme: 'colored',
      })

      return []
    }
  }

  const fetchS3Items = async (prefix = '') => {
    const s3 = new AWS.S3()
    const bucketName = 'sonoriza-media'

    const params = {
      Bucket: bucketName,
      Prefix: prefix,
    }

    try {
      const response = await s3.listObjectsV2(params).promise()

      const newItems =
        response.Contents?.map((content) => content.Key || '') || []
      return newItems as string[]
    } catch (error) {
      showToast('Error to list item', {
        type: 'error',
        theme: 'light',
      })

      return []
    }
  }

  const fetchSubFolder = async ({ folder }: SelectedPasteProps) => {
    const items = (await fetchS3Items(folder)).filter(
      (_item, index) => index !== 0,
    )

    return items
  }

  const fetchFolder = async ({ folder }: SelectedPasteProps) => {
    const response = await fetchS3Folders(folder)
    return response
  }

  const fetchRootPaste = () => {
    const response = fetchS3Folders().then((initialFolders) => {
      return initialFolders
    })

    return response
  }

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

  const signedUrl = async (url: string) => {
    const region = 'sa-east-1'
    const lambda = new Lambda({ region })

    const params = {
      FunctionName: 'cloudfront-presign-url',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ url }),
    }

    const response = await lambda.invoke(params).promise()
    const responseObject = await JSON.parse(String(response.Payload))

    return { responseObject }
  }

  function dropObject(
    e: DragEvent<HTMLDivElement>,
    setFiles: Dispatch<SetStateAction<FileWithType[]>>,
    setIsDrop: Dispatch<SetStateAction<boolean>>,
  ) {
    e.preventDefault()

    const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
      ['image/jpg', 'image/jpeg', 'image/png', 'audio/mpeg'].includes(
        file.type,
      ),
    ) as FileWithType[]

    if (newFiles.length === 0) {
      showToast('Archive type no suported', {
        type: 'error',
        theme: 'light',
      })
    } else {
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }

    setIsDrop(false)
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

  const uploadObject = async ({
    files,
    selectedFolder,
    type,
    isArtist,
  }: UploadObjectProps) => {
    const s3 = new AWS.S3()
    const bucketName = 'sonoriza-media'

    const uploadPromises = files.map(async (file) => {
      const params = {
        Bucket: bucketName,
        Key: `${type}/${file.name}`,
        Body: file,
        ContentType: file.type,
      }

      const musicParams = {
        Bucket: bucketName,
        Key: `${selectedFolder}${isArtist}/${file.name}`,
        Body: file,
        ContentType: file.type,
      }

      await s3.upload(type === 'artists' ? params : musicParams).promise()
      showToast(`Upload object ${file.name} as successfully`, {
        type: 'success',
        theme: 'light',
      })
    })

    await Promise.all(uploadPromises)
  }

  const createFolder = async ({
    folderName,
    selectedFolder,
  }: CreatePasteProps) => {
    const s3 = new AWS.S3()
    const bucketName = 'sonoriza-media'

    const folderKey = `${selectedFolder}${folderName}/`

    const params = {
      Bucket: bucketName,
      Key: folderKey,
      Body: '',
    }

    await s3.putObject(params).promise()

    showToast(`Folder ${folderName} created successfully`, {
      type: 'success',
      theme: 'light',
    })

    const response = await fetchS3Folders(selectedFolder)

    return response
  }

  const handleSubFolderClick = async ({
    folder,
    setFolderItems,
  }: SelectedPasteProps) => {
    try {
      setIsLoading(true)
      const response = await fetchSubFolder({
        folder,
      })

      if (response && setFolderItems) {
        setFolderItems(response)
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      showToast('Error fetch sub folder', {
        type: 'error',
        theme: 'light',
      })
    }
  }

  const handleFolderClick = async ({
    folder,
    setSubFolders,
  }: SelectedPasteProps) => {
    try {
      const response = await fetchFolder({ folder })
      if (response && setSubFolders) {
        setSubFolders(response)
      }
    } catch (error) {
      showToast('Error fetch folder', {
        type: 'error',
        theme: 'light',
      })
    }
  }

  const handleUploadObject = async ({
    files,
    selectedFolder,
    type,
    subFolders,
    setFolderItems,
    isArtist,
    setFiles,
  }: UploadObjectProps) => {
    try {
      setIsLoading(true)

      await uploadObject({
        files,
        selectedFolder,
        type,
        isArtist,
        setFiles,
        subFolders,
      })

      if (type === 'artists') {
        await handleSubFolderClick({
          folder: `${type}/`,
          setFolderItems,
        })
      } else {
        await handleSubFolderClick({
          folder: `${selectedFolder.split('/')[0]}/${isArtist}/`,
          setFolderItems,
        })
      }
      setIsLoading(false)
      setFiles([])
    } catch (error) {
      showToast('Error upload objects ', {
        type: 'error',
        theme: 'light',
      })
      setIsLoading(false)
    }
  }

  const handleSignedUrl = async (url: string) => {
    try {
      setIsLoading(true)
      const { responseObject } = await signedUrl(url)
      openModal({
        children: <ListenObject url={url} responseObject={responseObject} />,
        small: true,
      })
      setIsLoading(false)
    } catch (error) {
      showToast('Error signed URL', {
        type: 'error',
        theme: 'light',
      })
      setIsLoading(false)
    }
  }

  return {
    copyObjectUrl,
    createFolder,
    uploadObject,
    formatBytes,
    formatDate,
    fetchFolder,
    fetchSubFolder,
    fetchRootPaste,
    removeUploadFile,
    dropObject,
    signedUrl,
    handleFolderClick,
    handleSubFolderClick,
    handleUploadObject,
    handleSignedUrl,
    isLoading,
  }
}
