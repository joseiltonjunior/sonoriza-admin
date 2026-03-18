import { Button } from '@/components/Button'

import { Input } from '@/components/form/Input'
import { useForm } from 'react-hook-form'

import { DragEvent, useEffect, useMemo, useState } from 'react'

import {
  ArtistsResponseProps,
  ArtistsEditDataProps,
} from '@/types/artistsProps'
import { useToast } from '@/hooks/useToast'

import { useModal } from '@/hooks/useModal'
import { useDispatch, useSelector } from 'react-redux'

import { useKeenSlider } from 'keen-slider/react'

import { handleSetArtists } from '@/storage/modules/artists/reducer'

import { MusicResponseProps } from '@/types/musicProps'
import Skeleton from 'react-loading-skeleton'
import { FormMusic } from '../FormMusic'
import { Select } from '../form/Select'
import { ReduxProps } from '@/storage'
import { MusicalGenresProps } from '@/storage/modules/musicalGenres/reducer'
import { MusicalGenresDataProps } from '@/types/musicalGenresProps'
import { IoImage, IoTrash } from 'react-icons/io5'
import colors from 'tailwindcss/colors'
import { FileWithType, useUpload } from '@/hooks/useUpload'
import { api } from '@/services/api'
import { UploadObjectResponseProps } from '@/types/uploadProps'

interface FormArtistProps {
  artist?: ArtistsResponseProps
}

export interface UploadObjectProps {
  file: FileWithType
  title: string
}

export function FormArtist({ artist }: FormArtistProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [musics, setMusics] = useState<MusicResponseProps[]>()
  const [isDrop, setIsDrop] = useState(false)
  const [musicalGenresSelected, setMusicalGenresSelected] = useState<
    MusicalGenresDataProps[]
  >([])

  const [file, setFile] = useState<FileWithType>()

  const { register, handleSubmit, setValue } = useForm<ArtistsEditDataProps>()
  const { showToast } = useToast()
  const dispatch = useDispatch()
  const { closeModal, openModal } = useModal()

  const { formatBytes, formatDate } = useUpload()

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 7,
    },
  })

  const { musicalGenres } = useSelector<ReduxProps, MusicalGenresProps>(
    (state) => state.musicalGenres,
  )

  const musicalGenresOtions = useMemo(() => {
    const options = musicalGenres?.map((genre) => {
      return {
        label: genre.title,
        value: genre.id,
      }
    })

    if (!options) return

    return [{ label: 'Select', value: '' }, ...options]
  }, [musicalGenres])

  const handleUpdateArtist = async (data: ArtistsEditDataProps) => {
    setIsLoading(true)

    await api
      .patch(`/artists/${artist?.id}`, {
        title: data.title,
        photoURL:
          data.photoURL === '@PUSH'
            ? 'https://i.ibb.co/hZ7QNB3/sonoriza.png'
            : data.photoURL,
        genreIds: [musicalGenresSelected[0].id],
      })
      .then(async () => {
        let imgUrl = ''

        if (file) {
          const response = await uploadObject({ file, title: data.title })

          imgUrl = response[0].signedUrl
        } else {
          imgUrl = data.photoURL
        }

        await api.patch(`/artists/${artist?.id}`, {
          photoURL: imgUrl,
        })

        const responseArtists = await api
          .get('/artists')
          .then((res) => res.data.data as ArtistsResponseProps[])
        dispatch(handleSetArtists({ artists: responseArtists }))

        showToast('Artist updated successfully', {
          type: 'success',
          theme: 'light',
        })

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

  const handleSaveArtist = async (data: ArtistsEditDataProps) => {
    setIsLoading(true)

    await api
      .post('/artists', {
        title: data.title,
        photoURL: 'https://i.ibb.co/hZ7QNB3/sonoriza.png',
        genreIds: [data.musicalGenres],
      })
      .then(async (response) => {
        const newArtist = response.data as ArtistsResponseProps
        if (file) {
          const response = await uploadObject({ file, title: data.title })

          await api
            .patch(`/artists/${newArtist.id}`, {
              photoURL: response[0].signedUrl,
            })
            .then(async () => {
              const responseArtists = await api
                .get('/artists')
                .then((res) => res.data.data as ArtistsResponseProps[])
              dispatch(handleSetArtists({ artists: responseArtists }))

              setIsLoading(false)
              closeModal()
              showToast('Artist added successfully', {
                type: 'success',
                theme: 'light',
              })
            })
        }
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

  const handleGetMusics = async (id: string) => {
    try {
      const responseMusics = await api.get(`/musics?artistId=${id}`)

      setMusics(responseMusics.data.data as MusicResponseProps[])
    } catch (error) {
      console.log(error)
    }
  }

  const handleSelectMusicalGenre = (genreId: string) => {
    const isExists = musicalGenresSelected.find((item) => item.id === genreId)
    const musicalGenreSelected = musicalGenres.find(
      (item) => item.id === genreId,
    )
    if (isExists || !musicalGenreSelected) return
    setMusicalGenresSelected((prev) => [...prev, musicalGenreSelected])
  }

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

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const uploadObject = async ({ file, title }: UploadObjectProps) => {
    const formData = new FormData()

    formData.append('files', file)
    formData.append('folder', 'artists')
    formData.append('slug', slugify(title))

    const objectPathSigned = await api
      .post('/uploads', formData)
      .then((res) => res.data.files as UploadObjectResponseProps[])

    return objectPathSigned
  }

  async function submit(data: ArtistsEditDataProps) {
    setIsLoading(true)
    if (musicalGenresSelected.length === 0) {
      showToast('Select at least one musical genre', {
        type: 'error',
        theme: 'light',
      })

      return
    }

    if (!data.photoURL && !file) {
      showToast('Add artist photo', {
        type: 'error',
        theme: 'light',
      })

      return
    }

    let formArtist: ArtistsEditDataProps

    if (file) {
      formArtist = {
        ...data,
        photoURL: '@PUSH',
        // photoURL: response[0].signedUrl,
      }
    } else {
      formArtist = {
        ...data,
      }
    }

    if (data.id) {
      handleUpdateArtist(formArtist)
      return
    }
    handleSaveArtist(formArtist)
  }

  useEffect(() => {
    if (artist?.id) {
      handleGetMusics(artist.id)
    }
  }, [artist?.id])

  useEffect(() => {
    if (artist) {
      setValue('id', artist.id)
      setValue('title', artist.title)
      setValue('photoURL', artist.photoURL)
      setIsDrop(true)

      setValue('musicalGenres', artist.musicalGenres[0].id)

      setMusicalGenresSelected(artist.musicalGenres)
    }
  }, [artist, setValue])

  return (
    <div className="max-w-3xl">
      <h1 className="font-bold text-xl text-purple-600">
        {artist ? 'Edit' : 'Add new'} artist
      </h1>
      <div className="h-[1px] bg-gray-300/50 my-7" />

      {artist?.photoURL && (
        <>
          <p className="font-bold">Artist Photo</p>
          <img
            src={artist.photoURL}
            alt={artist.photoURL}
            className="rounded-full object-cover w-24 h-24"
          />
        </>
      )}

      {artist?.musics && artist.musics.length > 0 && (
        <div className="mt-4">
          <p className="font-bold">Musics</p>
          <div>
            {musics ? (
              <div
                ref={sliderRef}
                className="ken-slider flex overflow-hidden mt-2"
              >
                {musics.map((music) => (
                  <button
                    key={music.id}
                    className="keen-slider__slide flex flex-col items-center gap-2"
                    onClick={() => {
                      openModal({
                        children: <FormMusic musicId={music.id} />,
                      })
                    }}
                  >
                    <img
                      src={music.artwork}
                      alt="artwork"
                      className="rounded-xl object-cover w-24 h-24"
                    />
                    <p className="text-center text-sm font-medium">
                      {music.title}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 items-center">
                  <Skeleton width={112} height={112} borderRadius={12} />
                  <Skeleton height={16} width={112} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <Skeleton width={112} height={112} borderRadius={12} />
                  <Skeleton height={16} width={112} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {musicalGenresSelected.length > 0 && (
        <div className="mt-4">
          <p className="font-bold">Musical Genres</p>
          <div className="grid grid-cols-6 gap-2 mt-2">
            {musicalGenresSelected.map((genre) => (
              <div
                key={genre.title}
                className="bg-transparent border border-gray-700 p-2 rounded-lg flex items-center justify-center relative overflow-hidden h-14"
              >
                <button
                  className="absolute right-0 top-0 bg-red-600 p-1 rounded-bl-md hover:bg-red-700"
                  onClick={() => {
                    setMusicalGenresSelected((prev) =>
                      prev.filter((item) => item.title !== genre.title),
                    )
                  }}
                >
                  <IoTrash color={colors.white} size={12} />
                </button>
                <p className="font-semibold text-center">{genre.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="flex flex-col mt-4  ">
        <div className="">
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Artist name"
              label="Artist"
              name="title"
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
            <Select
              options={musicalGenresOtions}
              label="Musical Genrer"
              name="musicalGenres"
              register={register}
              onChange={(e) => handleSelectMusicalGenre(e.currentTarget.value)}
              required
            />
          </div>

          {!artist?.id && (
            <>
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
                          {formatBytes(file.size)} -{' '}
                          {formatDate(file.lastModified)}
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
                          Drop a artist image
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
                        <p className="text-white font-bold text-xl">
                          Drop your file
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-[1px] bg-gray-300/50 my-7" />

        <Button
          title={artist ? 'Edit' : 'Save'}
          className="max-w-[140px] ml-auto"
          variant="purple"
          isLoading={isLoading}
        />
      </form>
    </div>
  )
}
