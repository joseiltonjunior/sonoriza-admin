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
    try {
      await api.post('/genres', data)

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
    } catch (error) {
      setIsLoading(false)
      showToast(`Error adding music`, {
        type: 'error',
        theme: 'light',
      })
    }
  }

  const handleEditMusicalGenre = async (
    data: MusicalGenresDataProps,
    id: string,
  ) => {
    try {
      await api.patch(`/genres/${id}`, data)

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
    } catch (error) {
      setIsLoading(false)
      showToast(`Error editing musical genre`, {
        type: 'error',
        theme: 'light',
      })
    }
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
      setValue('name', isExist.name)
    }
  }, [isExist, setValue])

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          placeholder="Digit new musical genre"
          label="Musical Genre"
          name="name"
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
