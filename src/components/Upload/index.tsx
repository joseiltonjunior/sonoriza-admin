import { useModal } from '@/hooks/useModal'
import { useToast } from '@/hooks/useToast'

import * as yup from 'yup'

import { useEffect, useState } from 'react'
import { IoFolderOpenSharp } from 'react-icons/io5'
import { Button } from '../Button'

import { Input } from '../form/Input'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import {
  CreatePasteFormProps,
  FileWithType,
  useUpload,
} from '@/hooks/useUpload'
import { Artists } from './Artists'
import { Musics } from './Musics'

const formValidator = yup.object().shape({
  folderName: yup.string().required('Name is required'),
})

export function Upload() {
  const [folders, setFolders] = useState<string[]>([])
  const [subFolders, setSubFolders] = useState<string[]>([])
  const [selectedFolder, setSelectedFolder] = useState('')
  const [folderItems, setFolderItems] = useState<string[]>([])
  const [isArtist, setIsArtist] = useState('')
  const [isDrop, setIsDrop] = useState(false)
  const [files, setFiles] = useState<FileWithType[]>([])

  const { openModal, closeModal } = useModal()

  const { showToast } = useToast()
  const {
    fetchRootPaste,
    createFolder,
    handleFolderClick,
    handleSubFolderClick,
  } = useUpload()

  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<CreatePasteFormProps>({
    resolver: yupResolver(formValidator),
  })

  const handleFetchRootPaste = async () => {
    try {
      const response = await fetchRootPaste()
      setFolders(response)
    } catch (error) {
      showToast('Error fetch root S3 paste', {
        type: 'error',
        theme: 'light',
      })
    }
  }

  const onSubmit = async (data: CreatePasteFormProps) => {
    const { folderName } = data
    const response = await createFolder({ folderName, selectedFolder })
    setSubFolders(response)
    closeModal()
    reset()
  }

  useEffect(() => {
    handleFetchRootPaste()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="h-[1px] bg-gray-300/50 my-7" />

      {selectedFolder && (
        <div className="flex gap-1">
          <div className="flex gap-1 items-center">
            <button
              className="hover:text-purple-600 font-bold"
              onClick={() => {
                setIsArtist('')
                setSelectedFolder('')
                setFiles([])
              }}
            >
              Bucket
            </button>
            <p>/</p>

            {selectedFolder && (
              <button
                onClick={() => {
                  setIsArtist('')
                  setFiles([])
                }}
                className="hover:underline"
              >
                {selectedFolder.split('/')[0]}
              </button>
            )}

            {isArtist && (
              <button onClick={() => {}} className="flex gap-1">
                / <p className="hover:underline"> {isArtist}</p>
              </button>
            )}
          </div>

          {!isArtist && selectedFolder.includes('musics') && (
            <button
              className="ml-auto py-1 px-2 bg-purple-600 rounded-md text-white font-bold hover:bg-purple-700"
              onClick={() =>
                openModal({
                  title: 'Create paste',
                  small: true,
                  children: (
                    <div className="w-full flex-1 flex flex-col justify-between">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                          label="Paste name"
                          name="folderName"
                          register={register}
                          type="text"
                          error={errors.folderName}
                          placeholder="Enter paste name"
                        />
                        <div className="flex gap-2 mt-4">
                          <Button
                            type="button"
                            title="Cancel"
                            variant="outline"
                            onClick={() => {
                              closeModal()
                              clearErrors()
                            }}
                          />
                          <Button
                            type="submit"
                            title="Create"
                            variant="purple"
                          />
                        </div>
                      </form>
                    </div>
                  ),
                })
              }
            >
              Add paste
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col items-start mt-4">
        {!selectedFolder &&
          folders.map((item, index) => (
            <button
              className="hover:underline flex gap-2 items-center text-gray-700"
              key={index}
              onClick={() => {
                setSubFolders([])
                setFolderItems([])

                setSelectedFolder(item)

                if (item.includes('artists')) {
                  handleSubFolderClick({
                    folder: item,
                    setFolderItems,
                  })
                  return
                }

                handleFolderClick({
                  folder: item,
                  setSubFolders,
                })
              }}
            >
              <IoFolderOpenSharp />
              {item === selectedFolder ? <strong>{item}</strong> : item}
            </button>
          ))}

        {selectedFolder.includes('musics') && !isArtist && (
          <div className="flex flex-col items-start rounded border-2 border-dashed border-purple-600 p-6 w-full">
            {subFolders.map((item, index) => (
              <button
                className="hover:underline flex gap-2 text-gray-700 items-center"
                key={index}
                onClick={() => {
                  setIsArtist(item.replace('musics/', '').replace('/', ''))

                  handleSubFolderClick({
                    folder: item,
                    setFolderItems,
                  })
                }}
              >
                <IoFolderOpenSharp />
                {item.replace('musics/', '')}
              </button>
            ))}
          </div>
        )}

        {isArtist && selectedFolder.includes('musics') && (
          <Musics
            folderItems={folderItems}
            files={files}
            isDrop={isDrop}
            selectedFolder={selectedFolder}
            setIsDrop={setIsDrop}
            setFiles={setFiles}
            isArtist={isArtist}
            subFolders={subFolders}
            setFolderItems={setFolderItems}
          />
        )}

        {selectedFolder.includes('artists') && (
          <Artists
            folderItems={folderItems}
            files={files}
            isDrop={isDrop}
            selectedFolder={selectedFolder}
            setIsDrop={setIsDrop}
            setFiles={setFiles}
            setFolderItems={setFolderItems}
          />
        )}
      </div>
    </div>
  )
}
