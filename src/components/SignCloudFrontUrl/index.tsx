import { useForm } from 'react-hook-form'
import { Button } from '../Button'
import { Input } from '../form/Input'
import { useState } from 'react'
import { IoAdd, IoRemove } from 'react-icons/io5'
import colors from 'tailwindcss/colors'

import AWS from 'aws-sdk'
import { useToast } from '@/hooks/useToast'

interface SignCloudFrontProps {
  url1: string
}

AWS.config.update({
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  region: 'sa-east-1',
})

const lambda = new AWS.Lambda()

export function SignCloudFrontUrl() {
  const { register, handleSubmit } = useForm<SignCloudFrontProps>({
    shouldUnregister: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [numberOfUrls, setNumberOfUrls] = useState(1)
  const [urlsSigned, setUrlsSigned] = useState<string[]>([])

  const { showToast } = useToast()

  const handleSignedUrl = async (url: string[]) => {
    const keyId = import.meta.env.VITE_CLOUD_FRONT_KEY_ID
    const privateKey = import.meta.env.VITE_CLOUD_FRONT_PRIVATE_KEY

    const params = {
      FunctionName: 'cloudfront-presign-url',
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({ url, keyId, privateKey }),
    }

    setIsLoading(true)

    try {
      const response = await lambda.invoke(params).promise()
      const responseObject = JSON.parse(String(response.Payload))

      setUrlsSigned((prevUrls) => [...prevUrls, responseObject.signedUrl])
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      showToast('Error calling Lambda function', {
        type: 'error',
        theme: 'light',
      })
    }
  }

  function submit(data: SignCloudFrontProps) {
    const urls = Object.values(data)

    urls.forEach((url) => {
      handleSignedUrl(url)
    })
  }

  function handleAddUrl() {
    setNumberOfUrls((prevNumber) => prevNumber + 1)
  }

  function handleRemoveUrl() {
    setNumberOfUrls((prevNumber) => prevNumber - 1)
  }

  const handleCopyClick = async (url: string) => {
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

  return (
    <div>
      {urlsSigned.length > 0 ? (
        <div className="flex flex-col">
          <div className="h-[1px] bg-gray-300/50 my-7" />
          <div className="max-w-3xl flex flex-col gap-4">
            {urlsSigned.map((url, index) => (
              <div key={index}>
                <span className="font-bold text-sm text-gray-700">
                  URL {index + 1}
                </span>
                <div className="grid grid-cols-[680px,auto] mt-2">
                  <div className="bg-white rounded-l-xl p-2 flex flex-col">
                    <p className="line-clamp-1">{url}</p>
                  </div>
                  <button
                    className="bg-purple-600 p-2 text-white rounded-r-xl"
                    onClick={() => handleCopyClick(url)}
                  >
                    copy
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="h-[1px] bg-gray-300/50 my-7" />
          <Button
            title="Clear"
            className="max-w-[140px] ml-auto"
            variant="red"
            onClick={() => setUrlsSigned([])}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit(submit)} className="flex flex-col">
          <div className="h-[1px] bg-gray-300/50 mt-7 mb-3" />
          {[...Array(numberOfUrls)].map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr,30px,30px] items-end gap-2"
            >
              <Input
                placeholder={`www.sonoriza.com/${index + 1}`}
                label={`URL ${index + 1}`}
                name={`url${index + 1}`}
                register={register}
                required
              />

              {numberOfUrls === index + 1 && (
                <button
                  onClick={handleAddUrl}
                  className="h-6 w-6 rounded-full bg-green-600 mb-2 flex items-center justify-center hover:bg-green-600/90"
                  type="button"
                >
                  <IoAdd color={colors.white} />
                </button>
              )}

              {numberOfUrls === index + 1 && numberOfUrls > 1 && (
                <button
                  onClick={() => handleRemoveUrl()}
                  className="h-6 w-6 rounded-full bg-red-600 mb-2 flex items-center justify-center hover:bg-red-600/90"
                  type="button"
                >
                  <IoRemove color={colors.white} />
                </button>
              )}
            </div>
          ))}

          <div className="h-[1px] bg-gray-300/50 my-7" />

          <Button
            title="Sign"
            className="max-w-[140px] ml-auto"
            variant="purple"
            isLoading={isLoading}
          />
        </form>
      )}
    </div>
  )
}
