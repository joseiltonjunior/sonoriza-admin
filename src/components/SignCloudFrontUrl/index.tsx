import { useForm } from 'react-hook-form'
import { Button } from '../Button'
import { Input } from '../form/Input'
import { useState } from 'react'
import { IoAdd, IoRemove } from 'react-icons/io5'
import colors from 'tailwindcss/colors'

interface SignCloudFrontProps {
  url: string
}

export function SignCloudFrontUrl() {
  const { register, handleSubmit } = useForm<SignCloudFrontProps>({
    shouldUnregister: true,
  })
  //   const [isLoading, setIsLoading] = useState(false)
  const [numberOfUrls, setNumberOfUrls] = useState(1)

  function submit(data: SignCloudFrontProps) {
    console.log(data)
  }

  function handleAddUrl() {
    setNumberOfUrls((prevNumber) => prevNumber + 1)
  }

  function handleRemoveUrl() {
    setNumberOfUrls((prevNumber) => prevNumber - 1)
  }

  return (
    <div>
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
        />
      </form>
    </div>
  )
}
