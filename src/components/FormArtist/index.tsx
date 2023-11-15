import { Button } from '@/components/Button'

import { Input } from '@/components/form/Input'
import { useForm } from 'react-hook-form'

import { useEffect, useState } from 'react'

import {
  ArtistsResponseProps,
  ArtistsEditDataProps,
} from '@/types/artistsProps'
import { useToast } from '@/hooks/useToast'

import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { useModal } from '@/hooks/useModal'
import { useDispatch } from 'react-redux'

import { handleSetArtists } from '@/storage/modules/artists/reducer'

import { useFirebaseServices } from '@/hooks/useFirebaseServices'

interface FormArtistProps {
  artist?: ArtistsResponseProps
}

export function FormArtist({ artist }: FormArtistProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue } = useForm<ArtistsEditDataProps>()
  const { getArtists } = useFirebaseServices()
  const { showToast } = useToast()
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const handleUpdateArtist = async (data: ArtistsEditDataProps) => {
    const artistsCollection = 'artists'
    setIsLoading(true)

    if (data.id) {
      const artistsDocRef = doc(firestore, artistsCollection, data.id)

      try {
        const artistsDoc = await getDoc(artistsDocRef)

        if (artistsDoc.exists()) {
          await updateDoc(artistsDocRef, { ...data })

          showToast('Artist updated successfully', {
            type: 'success',
            theme: 'light',
          })

          const responseArtists = await getArtists()
          dispatch(handleSetArtists({ artists: responseArtists }))
        } else {
          showToast('Artist not found', {
            type: 'warning',
            theme: 'light',
          })
        }
        setIsLoading(false)
        closeModal()
      } catch (error) {
        setIsLoading(true)
        showToast(`Error updating artist`, {
          type: 'error',
          theme: 'light',
        })
      }
    }
  }

  const handleSaveArtist = async (data: ArtistsEditDataProps) => {
    const artistsCollection = 'artists'
    setIsLoading(true)

    try {
      const { id } = await addDoc(collection(firestore, artistsCollection), {
        ...data,
      })

      const artistsDocRef = doc(firestore, artistsCollection, id)
      await updateDoc(artistsDocRef, { id })

      showToast('Artist added successfully', {
        type: 'success',
        theme: 'light',
      })

      const responseArtists = await getArtists()
      dispatch(handleSetArtists({ artists: responseArtists }))

      setIsLoading(false)
      closeModal()
    } catch (error) {
      setIsLoading(false)
      showToast(`Error adding artist`, {
        type: 'error',
        theme: 'light',
      })
    }
  }

  function submit(data: ArtistsEditDataProps) {
    if (data.id) {
      handleUpdateArtist(data)
      return
    }
    handleSaveArtist(data)
  }

  useEffect(() => {
    if (artist) {
      setValue('id', artist.id)
      setValue('name', artist.name)
      setValue('photoURL', artist.photoURL)
    }
  }, [artist, setValue])

  return (
    <>
      <h1 className="font-bold text-xl text-purple-600">
        {artist ? 'Edit' : 'Add new'} artist
      </h1>
      <div className="h-[1px] bg-gray-300/50 my-7" />

      <form onSubmit={handleSubmit(submit)} className="flex flex-col">
        <div className="grid grid-cols-[250px,1fr] gap-4">
          <Input
            placeholder="Artist name"
            label="Artist"
            name="name"
            register={register}
            required
          />
          <Input
            placeholder="www.sonoriza.com"
            label="Photo Url"
            name="photoURL"
            register={register}
            required
          />
        </div>

        <div className="h-[1px] bg-gray-300/50 my-7" />

        <Button
          title="Save"
          className="max-w-[140px] ml-auto"
          variant="purple"
          isLoading={isLoading}
        />
      </form>
    </>
  )
}
