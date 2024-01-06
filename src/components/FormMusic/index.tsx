import { Button } from '@/components/Button'
import { extractColors } from 'extract-colors'
import { Input } from '@/components/form/Input'
import { useForm } from 'react-hook-form'

import { MusicEditDataProps, MusicResponseProps } from '@/types/musicProps'

import { DragEvent, useEffect, useMemo, useState } from 'react'
import { Select } from '../form/Select'
import {
  ArtistsResponseProps,
  ArtistsEditDataProps,
} from '@/types/artistsProps'
import { useToast } from '@/hooks/useToast'
import { IoClose, IoImage, IoMusicalNote, IoTrash } from 'react-icons/io5'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { firestore } from '@/services/firebase'
import { useModal } from '@/hooks/useModal'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'
import {
  ArtistsProps,
  handleSetArtists,
} from '@/storage/modules/artists/reducer'
import { MusicalGenresProps } from '@/storage/modules/musicalGenres/reducer'
import {
  musicsCollection,
  useFirebaseServices,
} from '@/hooks/useFirebaseServices'
import { handleTrackListRemote } from '@/storage/modules/trackListRemote/reducer'
import { FormArtist } from '../FormArtist'
import colors from 'tailwindcss/colors'
import { FileWithType, useUpload } from '@/hooks/useUpload'

import AWS from 'aws-sdk'

interface FormMusicProps {
  music?: MusicResponseProps
}

interface UploadObjectProps {
  files: FileWithType[]

  artist: string
}

export function FormMusic({ music }: FormMusicProps) {
  const [selectedArtists, setSelectedArtists] = useState<
    ArtistsEditDataProps[]
  >([])

  const [isLoading, setIsLoading] = useState(false)

  const [isDropArtwork, setIsDropArtwork] = useState(false)
  const [isDropMusic, setIsDropMusic] = useState(false)
  const [fileArtwork, setFileArtwork] = useState<FileWithType>()
  const [fileMusic, setFileMusic] = useState<FileWithType>()

  const [paletColorsArtwork, setPaletColorsArtwork] = useState<string[]>([])
  const [selectColor, setSelectColor] = useState('')

  const { register, setValue, handleSubmit } = useForm<MusicEditDataProps>()
  const { getMusics, getArtists, addMusicInArtists, removeMusicFromArtists } =
    useFirebaseServices()
  const { showToast } = useToast()
  const dispatch = useDispatch()
  const { closeModal, openModal } = useModal()

  const { formatBytes, formatDate, signedUrl, copyObjectUrl } = useUpload()

  const { artists } = useSelector<ReduxProps, ArtistsProps>(
    (state) => state.artists,
  )

  const { musicalGenres } = useSelector<ReduxProps, MusicalGenresProps>(
    (state) => state.musicalGenres,
  )

  const handleUpdateMusic = async (data: MusicEditDataProps) => {
    if (data.id) {
      const musicsDocRef = doc(firestore, musicsCollection, data.id)

      try {
        const musicsDoc = await getDoc(musicsDocRef)

        if (musicsDoc.exists()) {
          await updateDoc(musicsDocRef, { ...data })

          await addMusicInArtists(data)

          const responseArtists = await getArtists()
          dispatch(handleSetArtists({ artists: responseArtists }))

          showToast('Music updated successfully', {
            type: 'success',
            theme: 'light',
          })

          const responseMusics = await getMusics()
          dispatch(handleTrackListRemote({ trackListRemote: responseMusics }))
        } else {
          showToast('Music not found', {
            type: 'warning',
            theme: 'light',
          })
        }
        setIsLoading(false)
        closeModal()
      } catch (error) {
        setIsLoading(false)
        showToast(`Error updating music`, {
          type: 'error',
          theme: 'light',
        })
      }
    }
  }

  const handleSaveMusic = async (data: MusicEditDataProps) => {
    try {
      const { id } = await addDoc(collection(firestore, musicsCollection), {
        ...data,
      })

      const musicsDocRef = doc(firestore, musicsCollection, id)

      await updateDoc(musicsDocRef, { id })

      await addMusicInArtists({ ...data, id })

      showToast('Music added successfully', {
        type: 'success',
        theme: 'light',
      })

      const responseArtists = await getArtists()
      dispatch(handleSetArtists({ artists: responseArtists }))

      const responseMusics = await getMusics()
      dispatch(handleTrackListRemote({ trackListRemote: responseMusics }))

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

  const uploadObject = async ({ files, artist }: UploadObjectProps) => {
    const s3 = new AWS.S3()
    const bucketName = 'sonoriza-media'

    const uploadPromises = files.map(async (file) => {
      const params = {
        Bucket: bucketName,
        Key: `musics/${artist}/${file.name}`,
        Body: file,
        ContentType: file.type,
      }

      return await s3.upload(params).promise()
    })

    return await Promise.all(uploadPromises)
  }

  async function submit(data: MusicEditDataProps) {
    if (selectedArtists.length < 1) {
      showToast('Select at least one artist', {
        type: 'error',
        theme: 'light',
      })

      return
    }

    if (!fileArtwork && !music?.artwork) {
      showToast('Drop a music artwork', {
        type: 'error',
        theme: 'light',
      })

      return
    }

    if (!fileMusic && !music?.url) {
      showToast('Drop a music', {
        type: 'error',
        theme: 'light',
      })

      return
    }

    if (!data.genre) {
      showToast('Select at least one musical genre', {
        type: 'error',
        theme: 'light',
      })

      return
    }

    if (!data.color) {
      showToast('Select a color', {
        type: 'error',
        theme: 'light',
      })

      return
    }

    setIsLoading(true)

    const urlsSigned: string[] = []

    if (fileArtwork || fileMusic) {
      const filesToUpload = fileArtwork ? [fileArtwork] : []
      if (fileMusic) filesToUpload.push(fileMusic)

      const response = await uploadObject({
        files: filesToUpload,
        artist: selectedArtists[0].name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9]/g, '-')
          .toLowerCase(),
      })

      await Promise.all(
        response.map(async (item) => {
          const { responseObject } = await signedUrl(
            `${import.meta.env.VITE_CLOUD_FRONT_DOMAIN}${item.Key}`,
          )

          urlsSigned.push(responseObject.signedUrl)
        }),
      )
    }

    const musicUrl = urlsSigned.find((item) => item.includes('.mp3'))
    const artworkUrl = urlsSigned.find(
      (item) =>
        item.includes('.png') ||
        item.includes('.jpg') ||
        item.includes('.jpeg'),
    )

    const newMusic = {
      ...data,
      artists: selectedArtists,
      url: musicUrl ?? String(music?.url),
      artwork: artworkUrl ?? String(music?.artwork),
    }

    if (data.id) {
      handleUpdateMusic(newMusic)
    } else {
      handleSaveMusic(newMusic)
    }
  }

  const musicalGenresOtions = useMemo(() => {
    const options = musicalGenres?.map((genre) => {
      return {
        label: genre.name,
        value: genre.name,
      }
    })

    if (!options) return

    return [{ label: 'Select', value: '' }, ...options]
  }, [musicalGenres])

  const artistsOptions = useMemo(() => {
    const options = artists?.map((artist) => {
      return {
        label: artist.name,
        value: artist.id,
      }
    })

    if (!options) return

    return [{ label: 'Select one or more', value: '' }, ...options]
  }, [artists])

  const handleSelectedArtists = (artistId: string) => {
    const { id, name, photoURL, musicalGenres } = artists?.find(
      (artist) => artist.id === artistId,
    ) as ArtistsResponseProps

    const isArtistsExists = selectedArtists.find((item) => item.id === artistId)
    if (isArtistsExists) return

    setSelectedArtists([
      ...selectedArtists,
      { id, name, photoURL, musicalGenres },
    ])
    setValue('artists', [])
  }

  const handleRemoveArtists = async (
    music: MusicEditDataProps,
    artistRemoveId: string,
  ) => {
    if (music && music.artists.find((item) => item.id === artistRemoveId)) {
      await removeMusicFromArtists(music)
      const responseArtists = await getArtists()
      dispatch(handleSetArtists({ artists: responseArtists }))
    }

    const filter = selectedArtists.filter((item) => item.id !== artistRemoveId)
    setSelectedArtists(filter)
  }

  function dropObject(e: DragEvent<HTMLDivElement>, type: 'music' | 'artwork') {
    e.preventDefault()

    const file = e.dataTransfer.files[0]

    const imageTypes = ['image/jpg', 'image/jpeg', 'image/png']

    if (type === 'artwork' && imageTypes.includes(file.type)) {
      setFileArtwork(file)
      setIsDropArtwork(false)

      return
    }

    if (type === 'music' && file.type === 'audio/mpeg') {
      setFileMusic(file)
      setIsDropMusic(false)

      return
    }

    showToast('Archive type no suported', {
      type: 'error',
      theme: 'light',
    })
    setIsDropMusic(false)
    setIsDropArtwork(false)
  }

  const handleExtractColor = async (file: File) => {
    try {
      await extractColors(URL.createObjectURL(file)).then((result) => {
        const colors = result.map((palet) => palet.hex)
        setPaletColorsArtwork(colors)
      })
    } catch (error) {
      showToast('Erro fetch colors', {
        type: 'error',
        theme: 'light',
      })
    }
  }

  useEffect(() => {
    if (music) {
      setValue('album', music.album)
      setValue('artwork', music.artwork)
      setValue('color', music.color)
      setValue('title', music.title)
      setValue('title', music.title)
      setValue('url', music.url)
      setValue('genre', music.genre)
      setValue('id', music.id)

      setSelectedArtists(music.artists)
    }
  }, [music, setValue])

  useEffect(() => {
    if (fileArtwork) {
      handleExtractColor(fileArtwork)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileArtwork])

  return (
    <>
      <h1 className="font-bold text-xl text-purple-600">
        {music ? 'Edit' : 'Add new'} music
      </h1>
      <div className="h-[1px] bg-gray-300/50 my-7" />

      <div className="grid grid-cols-[1fr,120px]">
        {selectedArtists.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold mb-2">Artists</p>
            <div className="flex gap-2">
              {selectedArtists.map((artist) => (
                <div key={artist.id} className="flex">
                  <button
                    className="flex flex-col items-center justify-center overflow-hidden"
                    onClick={() => {
                      openModal({
                        children: (
                          <FormArtist
                            artist={artists.find(
                              (item) => item.id === artist.id,
                            )}
                          />
                        ),
                      })
                    }}
                  >
                    <img
                      src={artist.photoURL}
                      alt="photo artists"
                      title={artist.name}
                      className="object-cover w-28 h-28 rounded-xl"
                    />
                    <p className="text-center text-sm font-medium">
                      {artist.name}
                    </p>
                  </button>
                  <button
                    className="w-6 h-6 rounded-full bg-purple-700 items-center justify-center flex -ml-4 -mt-3 hover:bg-purple-500"
                    title="Remove"
                    onClick={() =>
                      handleRemoveArtists(
                        music as MusicEditDataProps,
                        artist.id,
                      )
                    }
                  >
                    <IoClose color={'#fff'} size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {music?.artwork && (
          <div>
            <p className="font-semibold mb-2">Artwork</p>
            <div>
              <img
                src={music.artwork}
                alt="artwork"
                className="object-cover w-28 h-28 rounded-xl"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 max-w-3xl">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDropArtwork(true)}
          className="border-dashed border border-purple-600 flex items-center justify-center rounded-xl h-[100px] flex-1 relative overflow-hidden"
        >
          {fileArtwork?.name ? (
            <div className="flex px-6 w-full">
              <img
                src={URL.createObjectURL(fileArtwork)}
                alt={fileArtwork.name}
                className="w-12 h-12 mr-2 rounded-full"
              />

              <div className="ml-2">
                <p className="font-medium text-sm">{fileArtwork.name}</p>
                <span className="text-[#71839B] text-xs font-normal">
                  {formatBytes(fileArtwork.size)} -{' '}
                  {formatDate(fileArtwork.lastModified)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFileArtwork(undefined)
                }}
                className="ml-auto"
              >
                <IoTrash color={colors.red[600]} size={20} />
              </button>
            </div>
          ) : (
            <>
              {music?.artwork ? (
                <button
                  title="Copy a link"
                  className="grid grid-cols-[20px,auto] gap-2 px-4 items-center justify-center overflow-hidden"
                  onClick={() => copyObjectUrl(music.artwork)}
                >
                  <IoImage color={colors.purple[600]} size={20} />
                  <p className="font-semibold text-purple-600 line-clamp-1">
                    {music.artwork}
                  </p>
                </button>
              ) : (
                <div className="flex gap-2 items-center justify-center">
                  <IoImage color={colors.purple[600]} size={20} />
                  <p className="font-semibold text-purple-600">
                    Drop a Artwork
                  </p>
                </div>
              )}
            </>
          )}
          {isDropArtwork && (
            <div
              onDrop={(e) => dropObject(e, 'artwork')}
              onDragLeave={() => setIsDropArtwork(false)}
              className="bg-black/80 w-full h-full absolute top-0 flex items-center justify-center "
            >
              <div className="pointer-events-none">
                <p className="text-white font-bold text-xl">Drop your file</p>
              </div>
            </div>
          )}
        </div>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDropMusic(true)}
          className="border-dashed border border-purple-600 h-[100px] rounded-xl flex-1 relative overflow-hidden flex items-center justify-center"
        >
          {isDropMusic && (
            <div
              onDrop={(e) => dropObject(e, 'music')}
              onDragLeave={() => setIsDropMusic(false)}
              className="bg-black/80 w-full h-full absolute top-0 flex items-center justify-center "
            >
              <div className="pointer-events-none">
                <p className="text-white font-bold text-xl">Drop your file</p>
              </div>
            </div>
          )}

          {fileMusic ? (
            <div className="flex px-6 w-full">
              <IoMusicalNote size={48} />

              <div className="ml-2">
                <p className="font-medium text-sm">{fileMusic.name}</p>
                <span className="text-[#71839B] text-xs font-normal">
                  {formatBytes(fileMusic.size)} -{' '}
                  {formatDate(fileMusic.lastModified)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setFileMusic(undefined)
                }}
                className="ml-auto"
              >
                <IoTrash color={colors.red[600]} size={20} />
              </button>
            </div>
          ) : (
            <>
              {music ? (
                <button
                  title="Copy a link"
                  className="grid grid-cols-[20px,auto] gap-1 px-4 items-center justify-center overflow-hidden"
                  onClick={() => copyObjectUrl(music.url)}
                >
                  <IoMusicalNote color={colors.purple[600]} size={20} />
                  <p className="font-semibold text-purple-600 line-clamp-1">
                    {music.url}
                  </p>
                </button>
              ) : (
                <div className="flex gap-2 items-center justify-center">
                  <IoMusicalNote color={colors.purple[600]} size={20} />
                  <p className="font-semibold text-purple-600">Drop a Music</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(submit)} className="flex flex-col">
        <div>
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Music Title"
              label="Title"
              name="title"
              register={register}
              required
            />
            <Input
              placeholder="Album Music"
              label="Album"
              name="album"
              register={register}
              required
            />
            <Select
              options={artistsOptions}
              label="Artists"
              name="artists"
              register={register}
              onChange={(e) => handleSelectedArtists(e.currentTarget.value)}
              required
            />
          </div>

          <div className="grid grid-cols-[250px,auto] gap-4 items-end">
            <Select
              options={musicalGenresOtions}
              label="Musical Genrer"
              name="genre"
              register={register}
              required
            />
            <div>
              <p className="font-bold text-sm my-3">
                {paletColorsArtwork.length > 0
                  ? 'Select a color'
                  : music?.color && 'Color'}
              </p>
              <div className="flex gap-2 items-center">
                {paletColorsArtwork.length > 0 ? (
                  paletColorsArtwork.map((color) => (
                    <button
                      type="button"
                      style={{ background: color }}
                      key={color}
                      className={`w-8 h-8 rounded-full ${
                        selectColor === color && 'border-2 border-black'
                      }`}
                      title={color}
                      onClick={() => {
                        setValue('color', color)
                        setSelectColor(color)
                      }}
                    />
                  ))
                ) : (
                  <>
                    {music?.color && (
                      <div
                        style={{ background: music.color }}
                        className="w-8 h-8 rounded-full "
                        title={music?.color}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="h-[1px] bg-gray-300/50 my-7" />

        <Button
          title={music ? 'Edit' : 'Save'}
          className="max-w-[140px] ml-auto"
          variant="purple"
          isLoading={isLoading}
        />
      </form>
    </>
  )
}
