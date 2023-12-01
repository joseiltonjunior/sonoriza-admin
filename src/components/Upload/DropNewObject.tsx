import { FileWithType, useUpload } from '@/hooks/useUpload'
import { Dispatch, SetStateAction } from 'react'
import { IoImage } from 'react-icons/io5'
import colors from 'tailwindcss/colors'

interface DropObjectProps {
  setIsDrop: Dispatch<SetStateAction<boolean>>
  setFiles: Dispatch<SetStateAction<FileWithType[]>>
}

export function DropObject({ setIsDrop, setFiles }: DropObjectProps) {
  const { dropObject } = useUpload()

  return (
    <div
      onDrop={(e) => dropObject(e, setFiles, setIsDrop)}
      onDragLeave={() => setIsDrop(false)}
      onDragOver={(e) => e.preventDefault()}
      className="bg-black/70 w-full h-full absolute left-0 top-0 flex flex-col items-center justify-center z-30"
    >
      <div className="flex flex-col items-center justify-center pointer-events-none">
        <IoImage color={colors.white} size={120} />
        <p className="font-bold text-white text-2xl">
          Drop a music or image object
        </p>
        <p className="font-semibold text-white text-base">
          only archives (.jpg | .jpeg | .png | .mp3)
        </p>
      </div>
    </div>
  )
}
