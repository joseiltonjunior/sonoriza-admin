import { useForm } from 'react-hook-form'
import { Button } from '../Button'
import { Input } from '../form/Input'
import { DragEvent, useState } from 'react'
import { FileWithType, useUpload } from '@/hooks/useUpload'
import { IoImage, IoTrash } from 'react-icons/io5'
import colors from 'tailwindcss/colors'
import { UploadObjectProps } from '../FormArtist'

import AWS from 'aws-sdk'
import { useToast } from '@/hooks/useToast'
import { useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'
import { UsersProps } from '@/storage/modules/users/reducer'

interface NotificationsProps {
  title: string
  body: string
  imageUrl: string
}

export function Notifications() {
  const { register, handleSubmit } = useForm<NotificationsProps>()

  // const [isLoading, setIsLoading] = useState(false)
  const [isDrop, setIsDrop] = useState(false)
  const [file, setFile] = useState<FileWithType>()

  const { users } = useSelector<ReduxProps, UsersProps>((state) => state.users)

  const { showToast } = useToast()

  const { formatBytes, formatDate, signedUrl } = useUpload()

  function dropObject(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()

    const file = e.dataTransfer.files[0]

    const imageTypes = ['image/jpg', 'image/jpeg', 'image/png']

    if (imageTypes.includes(file.type)) {
      setFile(file)
      setIsDrop(false)

      return
    }

    showToast('Archive type no suported', {
      type: 'error',
      theme: 'light',
    })
    setIsDrop(false)
  }

  const uploadObject = async ({ file }: UploadObjectProps) => {
    const s3 = new AWS.S3()
    const bucketName = 'sonoriza-media'

    const params = {
      Bucket: bucketName,
      Key: `artists/${file.name}`,
      Body: file,
      ContentType: file.type,
    }

    return await s3.upload(params).promise()
  }

  const onSubmit = async (data: NotificationsProps) => {
    const { body, title } = data

    if (!file) {
      showToast('Add artist photo', {
        type: 'error',
        theme: 'light',
      })

      return
    }

    const response = await uploadObject({ file })

    const {
      responseObject: { signedUrl: imageUrl },
    } = await signedUrl(import.meta.env.VITE_CLOUD_FRONT_DOMAIN + response.Key)

    const messages = users.map((user) => ({
      notification: {
        title,
        body,
        imageUrl,
      },
      token: user.tokenFcm,
    }))

    console.log(messages)
  }

  return (
    <div className="bg-white rounded-md p-4 mt-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          placeholder="Digit a notification title"
          label="Title"
          name="title"
          register={register}
          required
        />
        <Input
          placeholder="Digit a notification description"
          label="Description"
          name="body"
          register={register}
          required
        />
        <div className="flex flex-col">
          <h4 className="font-bold text-sm my-3">New photo</h4>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDrop(true)}
            className="border-dashed border border-purple-600 flex items-center justify-center rounded-xl h-[100px] overflow-hidden relative"
          >
            {file ? (
              <div className="flex px-6 w-full">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-12 h-12 mr-2 rounded-full"
                />

                <div className="ml-2">
                  <p className="font-medium text-sm">{file.name}</p>
                  <span className="text-[#71839B] text-xs font-normal">
                    {formatBytes(file.size)} - {formatDate(file.lastModified)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFile(undefined)
                  }}
                  className="ml-auto"
                >
                  <IoTrash color={colors.red[600]} size={20} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2 items-center justify-center">
                  <IoImage color={colors.purple[600]} size={20} />
                  <p className="font-semibold text-purple-600">
                    Drop a notification image
                  </p>
                </div>
              </>
            )}

            {isDrop && (
              <div
                onDrop={dropObject}
                onDragLeave={() => setIsDrop(false)}
                className="bg-black/80 w-full h-full absolute top-0 flex items-center justify-center "
              >
                <div className="pointer-events-none">
                  <p className="text-white font-bold text-xl">Drop your file</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <Button title={'Send'} variant="purple" />
      </form>
    </div>
  )
}
