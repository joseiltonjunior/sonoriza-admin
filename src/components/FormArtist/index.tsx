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
import { MusicResponseProps } from '@/types/musicProps'
import Skeleton from 'react-loading-skeleton'
import { IoClose } from 'react-icons/io5'

interface FormArtistProps {
  artist?: ArtistsResponseProps
}

export function FormArtist({ artist }: FormArtistProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [musics, setMusics] = useState<MusicResponseProps[]>()

  const { register, handleSubmit, setValue } = useForm<ArtistsEditDataProps>()
  const { getArtists, getMusicsById, getArtistById } = useFirebaseServices()
  const { showToast } = useToast()
  const dispatch = useDispatch()
  const { closeModal } = useModal()

  const handleUpdateArtist = async (data: ArtistsEditDataProps) => {
    const artistsCollection = 'artists'
    setIsLoading(true)

    if (data.id) {
      const artistsDocRef = doc(firestore, artistsCollection, data.id)
      const musicsId = musics?.map((music) => music.id)

      try {
        const artistsDoc = await getDoc(artistsDocRef)

        if (artistsDoc.exists()) {
          await updateDoc(artistsDocRef, { ...data, musics: musicsId })

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

  const handleGetMusics = async (id: string) => {
    try {
      const { musics } = await getArtistById(id)

      const responseMusics = await getMusicsById(musics)

      setMusics(responseMusics)
    } catch (error) {
      console.log(error)
    }
  }

  const handleRemoveMusic = (id: string) => {
    const filter = musics?.filter((music) => music.id !== id)
    setMusics(filter)
  }

  useEffect(() => {
    if (artist?.id) {
      handleGetMusics(artist.id)
    }
  }, [artist?.id])

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

      {artist?.musics && artist.musics.length > 0 && (
        <div className="mb-7">
          <p className="font-bold">Musics</p>
          <div className="flex mt-2 gap-2">
            {musics ? (
              musics.map((music) => (
                <div key={music.id} className="flex">
                  <div className="flex flex-col gap-2 items-center w-32">
                    <img
                      src={music.artwork}
                      alt="artwork"
                      className="h-20 w-20 rounded-full"
                    />
                    <p className="text-center text-sm">{music.title}</p>
                  </div>
                  <button
                    className="w-6 h-6 rounded-full bg-purple-700 items-center justify-center flex -ml-10 -mt-1 hover:bg-purple-500"
                    title="Remove"
                    onClick={() => handleRemoveMusic(music.id)}
                  >
                    <IoClose color={'#fff'} size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <Skeleton width={80} height={80} borderRadius={80} />
                  <Skeleton height={16} width={108} />
                </div>
                <div className="flex flex-col items-center">
                  <Skeleton width={80} height={80} borderRadius={80} />
                  <Skeleton height={16} width={108} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="flex flex-col">
        <div className="grid grid-cols-[250px,300px] gap-4">
          <Input
            placeholder="Artist name"
            label="Artist"
            name="name"
            register={register}
            required
          />
          {artist?.id && (
            <Input
              placeholder="ID"
              label="ID"
              name="id"
              register={register}
              required
              disabled
            />
          )}
        </div>
        <Input
          placeholder="www.sonoriza.com"
          label="Photo Url"
          name="photoURL"
          register={register}
          required
        />

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
