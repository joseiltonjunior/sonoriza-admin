import { FileWithType, useUpload } from '@/hooks/useUpload'
import { Dispatch, SetStateAction } from 'react'
import {
  IoImage,
  IoMusicalNote,
  IoMusicalNoteSharp,
  IoTrash,
} from 'react-icons/io5'
import colors from 'tailwindcss/colors'
import { Button } from '../Button'
import Skeleton from 'react-loading-skeleton'
import { DropObject } from './DropNewObject'

interface MusicsProps {
  folderItems: string[]
  files: FileWithType[]
  setIsDrop: Dispatch<SetStateAction<boolean>>
  setFiles: Dispatch<SetStateAction<FileWithType[]>>
  subFolders: string[]
  selectedFolder: string
  isDrop: boolean
  isArtist: string
  setFolderItems: Dispatch<SetStateAction<string[]>>
}

export function Musics({
  folderItems,
  files,
  setFiles,
  setIsDrop,
  setFolderItems,
  isDrop,
  subFolders,
  isArtist,
  selectedFolder,
}: MusicsProps) {
  const {
    handleSignedUrl,
    dropObject,
    formatBytes,
    formatDate,
    removeUploadFile,
    isLoading,
    handleUploadObject,
  } = useUpload()

  if (isLoading && !files) {
    return <Skeleton height={200} width={700} />
  }

  return (
    <>
      {folderItems.length === 0 && (
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
                        {formatBytes(file.size)} -{' '}
                        {formatDate(file.lastModified)}
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
                    type: 'musics',
                    isArtist,
                    subFolders,
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
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => setIsDrop(true)}
              className="flex justify-center gap-2 items-center rounded border-2 border-dashed border-purple-600 p-6 w-full relative h-96"
            >
              {isDrop && (
                <DropObject setFiles={setFiles} setIsDrop={setIsDrop} />
              )}
              <p className="font-medium">Drop a new object</p>
            </div>
          )}
        </>
      )}

      {folderItems && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDrop(true)}
          className="flex flex-col items-start rounded border-2 border-dashed border-purple-600 p-6 w-full relative h-full min-h-[305px]"
        >
          {isDrop && <DropObject setFiles={setFiles} setIsDrop={setIsDrop} />}
          {files.length > 0 ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => dropObject(e, setFiles, setIsDrop)}
              className="w-full flex flex-col"
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
                        {formatBytes(file.size)} -{' '}
                        {formatDate(file.lastModified)}
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
                    type: 'musics',
                    isArtist,
                    subFolders,
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
            <>
              {folderItems.map((file, index) => (
                <button
                  className="hover:underline text-left flex gap-2 text-gray-700 items-center"
                  key={index}
                  onClick={() => {
                    handleSignedUrl(
                      import.meta.env.VITE_CLOUD_FRONT_DOMAIN + file,
                    )
                  }}
                >
                  {file.endsWith('mp3') ? <IoMusicalNote /> : <IoImage />}
                  {file.replace(`musics/${isArtist}/`, '')}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </>
  )
}
