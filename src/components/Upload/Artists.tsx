import { IoImage, IoMusicalNoteSharp, IoTrash } from 'react-icons/io5'
import { FileWithType, useUpload } from '@/hooks/useUpload'
import colors from 'tailwindcss/colors'
import { Button } from '../Button'
import { Dispatch, SetStateAction } from 'react'
import Skeleton from 'react-loading-skeleton'

interface ArtistsProps {
  folderItems: string[]
  files: FileWithType[]

  selectedFolder: string
  isDrop: boolean
  setIsDrop: Dispatch<SetStateAction<boolean>>
  setFiles: Dispatch<SetStateAction<FileWithType[]>>
  setFolderItems: Dispatch<SetStateAction<string[]>>
}

export function Artists({
  folderItems,
  files,
  isDrop,
  selectedFolder,
  setFolderItems,
  setIsDrop,
  setFiles,
}: ArtistsProps) {
  const {
    dropObject,
    formatBytes,
    formatDate,
    removeUploadFile,
    handleUploadObject,
    isLoading,
    handleSignedUrl,
  } = useUpload()

  const DOMAIN_CLOUDFRONT = import.meta.env.VITE_CLOUD_FRONT_DOMAIN

  if (isLoading && !files) {
    return <Skeleton height={200} width={700} />
  }

  return (
    <>
      {files.length > 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => dropObject(e, setFiles, setIsDrop)}
          className="flex flex-col items-start rounded border-2 border-dashed border-purple-600 p-4 w-full z-0"
        >
          <ul className="w-full">
            {files.map((file, index) => (
              <li
                key={index}
                className="h-[71px] rounded border-b border-gray-300 py-3 flex items-center"
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
                    removeUploadFile(index, setFiles)
                  }}
                  className="ml-auto"
                >
                  <IoTrash color={colors.red[600]} size={20} />
                </button>
              </li>
            ))}
          </ul>
          <Button
            onClick={() =>
              handleUploadObject({
                files,
                selectedFolder,
                type: 'artists',
                setFiles,
                setFolderItems,
              })
            }
            title="Upload"
            className="mt-4 w-32 ml-auto"
            variant="purple"
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div
          onDragEnter={() => setIsDrop(true)}
          className="flex flex-col items-start rounded border-2 border-dashed border-purple-600 p-6 w-full relative"
        >
          {isDrop && (
            <div
              onDrop={(e) => dropObject(e, setFiles, setIsDrop)}
              onDragLeave={() => setIsDrop(false)}
              onDragOver={(e) => e.preventDefault()}
              className="bg-black/70 w-full h-full absolute left-0 top-0 flex flex-col items-center justify-center z-30"
            >
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <IoImage color={colors.white} size={120} />
                <p className="font-bold text-white text-2xl">
                  Drop a artist image
                </p>
                <p className="font-semibold text-white text-base">
                  only archives (.jpg | .jpeg | .png)
                </p>
              </div>
            </div>
          )}
          {folderItems.map((item, index) => (
            <button
              className="hover:underline flex gap-2 text-gray-700 items-center"
              key={index}
              onClick={() => {
                handleSignedUrl(DOMAIN_CLOUDFRONT + item)
              }}
            >
              <IoImage />
              {item.replace('artists/', '')}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
