import { MusicalGenresDataProps } from '@/types/musicalGenresProps'
import { Input } from '../form/Input'
import { useForm } from 'react-hook-form'
import { Button } from '../Button'
import { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { handleSetMusicalGenres } from '@/storage/modules/musicalGenres/reducer'
import { useToast } from '@/hooks/useToast'
import { useModal } from '@/hooks/useModal'
import { api } from '@/services/api'

interface FormMusicalGenresProps {
  isExist?: MusicalGenresDataProps
}

export function FormMusicalGenres({ isExist }: FormMusicalGenresProps) {
  const { register, handleSubmit, setValue } = useForm<MusicalGenresDataProps>()

  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const { showToast } = useToast()
  const { closeModal } = useModal()

  const handleSaveNewMusicalGenre = async (data: MusicalGenresDataProps) => {
    await api
      .post('/genres', data)
      .then(async () => {
        showToast('Musical genre added successfully', {
          type: 'success',
          theme: 'light',
        })

        const responseGenres = await api
          .get('/genres')
          .then((res) => res.data.data as MusicalGenresDataProps[])
        dispatch(handleSetMusicalGenres({ musicalGenres: responseGenres }))

        setIsLoading(false)
        closeModal()
      })
      .catch((err) => {
        const errResponse = err.response.data
        setIsLoading(false)
        showToast(`${errResponse.message}`, {
          type: 'error',
          theme: 'light',
        })
      })
  }

  const handleEditMusicalGenre = async (
    data: MusicalGenresDataProps,
    id: string,
  ) => {
    await api
      .patch(`/genres/${id}`, data)
      .then(async () => {
        showToast('Musical genre edited successfully', {
          type: 'success',
          theme: 'light',
        })

        const responseGenres = await api
          .get('/genres')
          .then((res) => res.data.data as MusicalGenresDataProps[])
        dispatch(handleSetMusicalGenres({ musicalGenres: responseGenres }))

        setIsLoading(false)
        closeModal()
      })
      .catch((err) => {
        const errResponse = err.response.data
        setIsLoading(false)
        showToast(`${errResponse.message}`, {
          type: 'error',
          theme: 'light',
        })
      })
  }

  const onSubmit = (data: MusicalGenresDataProps) => {
    setIsLoading(true)

    if (isExist) {
      handleEditMusicalGenre(data, isExist.id)
    } else {
      handleSaveNewMusicalGenre(data)
    }
  }

  useEffect(() => {
    if (isExist) {
      setValue('title', isExist.title)
    }
  }, [isExist, setValue])

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          placeholder="Digit new musical genre"
          label="Musical Genre"
          name="title"
          register={register}
          required
        />
        <Button
          title={isExist ? 'Edit' : 'Save'}
          variant="purple"
          isLoading={isLoading}
        />
      </form>
    </div>
  )
}
