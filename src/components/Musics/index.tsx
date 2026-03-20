import { MusicResponseProps } from '@/types/musicProps'
import { useEffect, useRef, useState } from 'react'
import { IoHeart, IoPlay, IoTrash } from 'react-icons/io5'
import colors from 'tailwindcss/colors'
import { FormMusic } from '../FormMusic'

import { useModal } from '@/hooks/useModal'
import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'

import {
  TrackListRemoteProps,
  handleAppendTrackListRemote,
  handleTrackListRemote,
} from '@/storage/modules/trackListRemote/reducer'
import { useToast } from '@/hooks/useToast'
import { api } from '@/services/api'
import {
  EMPTY_PAGINATION_META,
  type PaginatedResponseProps,
  type PaginationMetaProps,
  normalizePaginationMeta,
} from '@/types/paginationProps'

export function Musics() {
  const { trackListRemote, currentPage, lastPage, totalItems } = useSelector<
    ReduxProps,
    TrackListRemoteProps
  >((state) => state.trackListRemote)

  const [titleFilter, setTitleFilter] = useState('')
  const [musicsFiltered, setMusicFilteres] = useState<MusicResponseProps[]>([])
  const [filteredMeta, setFilteredMeta] = useState<PaginationMetaProps>(
    EMPTY_PAGINATION_META,
  )
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const isLoadingMoreRef = useRef(false)
  const paginationMetaRef = useRef<PaginationMetaProps>(EMPTY_PAGINATION_META)
  const isFilteringRef = useRef(false)
  const isSearchingRef = useRef(false)
  const titleFilterRef = useRef('')
  const canLoadMoreRef = useRef(false)

  const dispatch = useDispatch()

  const { openModal, closeModal } = useModal()
  const { showToast } = useToast()

  const isFiltering = titleFilter.trim().length >= 3
  const musicsToRender = isFiltering ? musicsFiltered : trackListRemote
  const paginationMeta = isFiltering
    ? filteredMeta
    : {
        currentPage,
        lastPage,
        totalItems,
      }

  const canLoadMore =
    paginationMeta.lastPage > 0 &&
    paginationMeta.currentPage < paginationMeta.lastPage

  const handleFetchMusicPage = async (page: number, filter?: string) => {
    const response = await api.get<PaginatedResponseProps<MusicResponseProps>>(
      '/musics',
      {
        params: {
          page,
          ...(filter ? { title: filter } : {}),
        },
      },
    )

    const pagination = normalizePaginationMeta(
      response.data.meta,
      response.data.data.length,
    )

    return {
      musics: response.data.data,
      pagination,
    }
  }

  const handleFilterMusic = async (filter: string) => {
    setTitleFilter(filter)

    if (filter.trim().length < 3) {
      setMusicFilteres([])
      setFilteredMeta(EMPTY_PAGINATION_META)
      return
    }

    try {
      setIsSearching(true)
      const response = await handleFetchMusicPage(1, filter.trim())
      setMusicFilteres(response.musics)
      setFilteredMeta(response.pagination)
    } catch (error) {
      showToast('Error fetching musics', {
        type: 'error',
        theme: 'light',
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleRemoveMusic = async (music: MusicResponseProps) => {
    if (music.id) {
      try {
        await api.delete(`/musics/${music.id}`)

        showToast('Music removed successfully', {
          type: 'success',
          theme: 'light',
        })

        closeModal()

        if (isFiltering) {
          setMusicFilteres((prev) =>
            prev.filter((item) => item.id !== music.id),
          )
          setFilteredMeta((prev) => ({
            ...prev,
            totalItems: Math.max(0, prev.totalItems - 1),
          }))
          return
        }

        dispatch(
          handleTrackListRemote({
            trackListRemote: trackListRemote.filter(
              (item) => item.id !== music.id,
            ),
            currentPage,
            lastPage,
            totalItems: Math.max(0, totalItems - 1),
          }),
        )
      } catch (error) {
        showToast(`Error removing music`, {
          type: 'error',
          theme: 'light',
        })
      }
    }
  }

  useEffect(() => {
    if (!isFiltering) {
      setMusicFilteres([])
      setFilteredMeta(EMPTY_PAGINATION_META)
    }
  }, [isFiltering, trackListRemote])

  useEffect(() => {
    paginationMetaRef.current = isFiltering
      ? filteredMeta
      : {
          currentPage,
          lastPage,
          totalItems,
        }
    isFilteringRef.current = isFiltering
    isSearchingRef.current = isSearching
    titleFilterRef.current = titleFilter.trim()
    canLoadMoreRef.current = canLoadMore
  }, [
    canLoadMore,
    currentPage,
    filteredMeta,
    isFiltering,
    isSearching,
    lastPage,
    titleFilter,
    totalItems,
  ])

  useEffect(() => {
    const loadMoreMusics = async () => {
      const nextPage = paginationMetaRef.current.currentPage + 1

      if (
        !canLoadMoreRef.current ||
        nextPage <= 0 ||
        isSearchingRef.current ||
        isLoadingMoreRef.current
      ) {
        return
      }

      try {
        isLoadingMoreRef.current = true
        setIsLoadingMore(true)

        const response = await handleFetchMusicPage(
          nextPage,
          isFilteringRef.current ? titleFilterRef.current : undefined,
        )
        paginationMetaRef.current = response.pagination
        canLoadMoreRef.current =
          response.pagination.lastPage > 0 &&
          response.pagination.currentPage < response.pagination.lastPage

        if (isFilteringRef.current) {
          setMusicFilteres((prev) => [...prev, ...response.musics])
          setFilteredMeta(response.pagination)
          return
        }

        dispatch(
          handleAppendTrackListRemote({
            trackListRemote: response.musics,
            currentPage: response.pagination.currentPage,
            lastPage: response.pagination.lastPage,
            totalItems: response.pagination.totalItems,
          }),
        )
      } catch (error) {
        showToast('Error fetching more musics', {
          type: 'error',
          theme: 'light',
        })
      } finally {
        isLoadingMoreRef.current = false
        setIsLoadingMore(false)
      }
    }

    const handleScroll = () => {
      if (
        !canLoadMoreRef.current ||
        isSearchingRef.current ||
        isLoadingMoreRef.current
      ) {
        return
      }

      const viewportHeight = window.innerHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const fullHeight = document.documentElement.scrollHeight

      if (!fullHeight) {
        return
      }

      const scrollProgress = (scrollTop + viewportHeight) / fullHeight

      if (scrollProgress >= 0.8) {
        loadMoreMusics()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [dispatch, showToast])

  return (
    <div>
      <div className="h-[1px] bg-gray-300/50 my-7" />
      <div className="mt-8">
        <h4 className="font-bold text-sm my-3">Search by title</h4>
        <input
          placeholder="Type a Song"
          type="text"
          onChange={(e) => {
            handleFilterMusic(e.currentTarget.value)
          }}
          className={
            'w-72 bg-white border border-gray-300 rounded px-4 py-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm font-normal data-[is-error=true]:border-red-600'
          }
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {musicsToRender.length} of {paginationMeta.totalItems} musics
        </p>

        {isFiltering && (
          <p className="text-sm text-gray-500">
            {isSearching ? 'Searching...' : `Filtered by "${titleFilter}"`}
          </p>
        )}
      </div>

      {musicsToRender.map((music) => (
        <div
          key={music.id}
          className={`bg-white rounded-2xl p-7 mt-8 top-5 grid grid-cols-[1fr,auto,30px] gap-12 border hover:border-gray-300 w-full items-center justify-between`}
        >
          <button
            className="flex items-center gap-4"
            title="Open music"
            onClick={() => {
              openModal({
                children: <FormMusic musicId={music.id} />,
              })
            }}
          >
            <div className="bg-gray-700 w-16 h-16 rounded-full overflow-hidden">
              <img
                src={music.artwork}
                alt="artwork track music"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <p className="text-purple-600 font-bold">{music.title}</p>
              <p>ID: {music.id}</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-1" title="Likes">
                  <IoHeart color={colors.red[600]} />
                  <p className="font-semibold">{music.like ?? 0}</p>
                </div>

                <div className="flex items-center gap-1" title="Streams">
                  <IoPlay color={colors.blue[600]} />
                  <p className="font-semibold">{music.view ?? 0}</p>
                </div>
              </div>
            </div>
          </button>

          <div className="items-end flex flex-col">
            {music.artists.map((artist) => (
              <p key={artist.id} className="font-semibold">
                {artist.title}
              </p>
            ))}
          </div>

          <button
            title="Remove"
            className="p-2 rounded-full"
            onClick={() => {
              openModal({
                textConfirm: 'Delete',
                description: 'Do you really want to delete the music?',
                title: 'Attention',

                confirm() {
                  handleRemoveMusic(music)
                },
              })
            }}
          >
            <IoTrash size={22} color={colors.red[600]} />
          </button>
        </div>
      ))}

      {musicsToRender.length === 0 && !isSearching && (
        <div className="bg-white rounded-2xl p-7 mt-8 border text-center text-gray-500">
          No musics found.
        </div>
      )}

      {isLoadingMore && (
        <div className="mt-8 flex items-center justify-center gap-3 text-sm text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-purple-200 border-t-purple-600" />
          <p>Loading more musics...</p>
        </div>
      )}
    </div>
  )
}
