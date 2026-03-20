import { Layout } from '@/components/Layout'
import { useToast } from '@/hooks/useToast'

import { useEffect, useMemo, useState } from 'react'

import Skeleton from 'react-loading-skeleton'

import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'
import { SideMenuProps } from '@/storage/modules/sideMenu/reducer'

import { Button } from '@/components/Button'
import { FormMusic } from '@/components/FormMusic'

import { Users } from '@/components/Users'
import { Artists } from '@/components/Artists'

import { Musics } from '@/components/Musics'

import { useModal } from '@/hooks/useModal'
import {
  TrackListRemoteProps,
  handleTrackListRemote,
} from '@/storage/modules/trackListRemote/reducer'
import {
  ArtistsProps,
  handleSetArtists,
} from '@/storage/modules/artists/reducer'
import {
  MusicalGenresProps,
  handleSetMusicalGenres,
} from '@/storage/modules/musicalGenres/reducer'

import { handleSetUsers, UsersProps } from '@/storage/modules/users/reducer'
import { FormArtist } from '@/components/FormArtist'
import { MusicalGenres } from '@/components/MusicalGenres'
import { SignCloudFrontUrl } from '@/components/SignCloudFrontUrl'
import { Graphics } from '@/components/Graphics'
import { FormMusicalGenres } from '@/components/FormMusicalGenres'
import { Notifications } from '@/components/Notifications'
import { api } from '@/services/api'
import { MusicalGenresDataProps } from '@/types/musicalGenresProps'
import { MusicResponseProps } from '@/types/musicProps'
import { ArtistsResponseProps } from '@/types/artistsProps'
import { UserDataProps } from '@/types/userProps'
import {
  GetMetricStatisticsOutput,
  MetricsOverviewProps,
} from '@/types/metricsProps'
import {
  type PaginatedResponseProps,
  normalizePaginationMeta,
} from '@/types/paginationProps'

export function Home() {
  const { showToast } = useToast()
  const { openModal } = useModal()

  const [bucketMetrics, setBucketMetrics] = useState<
    GetMetricStatisticsOutput[]
  >([])
  const [overviewMetrics, setOverviewMetrics] =
    useState<MetricsOverviewProps | null>(null)
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false)

  const { artists } = useSelector<ReduxProps, ArtistsProps>(
    (state) => state.artists,
  )
  const { trackListRemote } = useSelector<ReduxProps, TrackListRemoteProps>(
    (state) => state.trackListRemote,
  )
  const { musicalGenres } = useSelector<ReduxProps, MusicalGenresProps>(
    (state) => state.musicalGenres,
  )

  const { users } = useSelector<ReduxProps, UsersProps>((state) => state.users)

  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const { tag } = useSelector<ReduxProps, SideMenuProps>(
    (state) => state.sideMenu,
  )

  const excludePath = [
    'users',
    'graphics',
    'signUrl',
    'upload',
    'notifications',
  ]

  const handleFormatTitle = useMemo(() => {
    switch (tag) {
      case 'artists':
        return `Artists`

      case 'genres':
        return `Musical Genres`

      case 'musics':
        return `Musics`

      case 'users':
        return `Users`

      case 'signUrl':
        return 'Sign CloudFront URL'

      case 'graphics':
        return 'Graphics'

      case 'upload':
        return 'Bucket S3'

      case 'notifications':
        return 'Notifications'

      default:
        return ''
    }
  }, [tag])

  useEffect(() => {
    async function handleFetchMetricsAWS() {
      try {
        setIsLoadingMetrics(true)
        const [responseMetricsStorage, responseMetricsOverview] =
          await Promise.all([
            api
              .get('/metrics/storage')
              .then((res) => res.data.data as GetMetricStatisticsOutput[]),
            api
              .get('/metrics/overview')
              .then((res) => res.data as MetricsOverviewProps),
          ])

        if (responseMetricsOverview) {
          setOverviewMetrics(responseMetricsOverview)
        }

        if (responseMetricsStorage) {
          setBucketMetrics(responseMetricsStorage)
        }
      } catch (error) {
        showToast('Error fetching metric', {
          type: 'error',
          theme: 'colored',
        })
      } finally {
        setIsLoadingMetrics(false)
      }
    }

    handleFetchMetricsAWS()
  }, [showToast])

  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true)
        const [musicsResponse, artistsResponse, genresResponse, usersResponse] =
          await Promise.all([
            api.get<PaginatedResponseProps<MusicResponseProps>>('/musics'),
            api.get('/artists'),
            api.get('/genres'),
            api.get('/users'),
          ])

        const musicsMeta = normalizePaginationMeta(
          musicsResponse.data.meta,
          musicsResponse.data.data.length,
        )

        dispatch(
          handleTrackListRemote({
            trackListRemote: musicsResponse.data.data as MusicResponseProps[],
            currentPage: musicsMeta.currentPage,
            lastPage: musicsMeta.lastPage,
            totalItems: musicsMeta.totalItems,
          }),
        )

        dispatch(
          handleSetArtists({
            artists: artistsResponse.data.data as ArtistsResponseProps[],
          }),
        )

        dispatch(
          handleSetMusicalGenres({
            musicalGenres: genresResponse.data.data as MusicalGenresDataProps[],
          }),
        )

        dispatch(
          handleSetUsers({ users: usersResponse.data.data as UserDataProps[] }),
        )

        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        showToast('Error fetching data', {
          type: 'error',
          theme: 'colored',
        })
      }
    }

    loadInitialData()
  }, [dispatch, showToast])

  return (
    <Layout>
      <div className={`${tag !== 'graphics' && 'max-w-3xl'} pb-8`}>
        <div className="grid grid-cols-[1fr,80px] justify-between items-center">
          <div>
            <h1 className="font-bold text-gray-700 leading-6">Home</h1>
            <h3 className="font-bold text-purple-600 leading-8 text-xl">
              {handleFormatTitle}
            </h3>
          </div>

          {!excludePath.includes(tag) && (
            <>
              <Button
                title="Add"
                variant="purple"
                onClick={() => {
                  switch (tag) {
                    case 'musics':
                      openModal({
                        children: <FormMusic />,
                      })
                      break

                    case 'artists':
                      openModal({
                        children: <FormArtist />,
                      })
                      break

                    case 'genres':
                      openModal({
                        children: <FormMusicalGenres />,
                      })
                      break

                    default:
                      break
                  }
                }}
              />
            </>
          )}
        </div>

        {tag === 'musics' && trackListRemote && <Musics />}

        {tag === 'artists' && artists && <Artists />}

        {tag === 'genres' && musicalGenres && <MusicalGenres />}

        {tag === 'users' && users && <Users />}

        {tag === 'signUrl' && <SignCloudFrontUrl />}

        {tag === 'graphics' && !isLoadingMetrics && overviewMetrics && (
          <Graphics
            metricsS3={bucketMetrics}
            metricsOverview={overviewMetrics}
          />
        )}

        {tag === 'notifications' && <Notifications />}

        {isLoading && (
          <>
            <Skeleton className="h-[80px] mt-8 rounded-2xl" />
            <Skeleton className="h-[80px] mt-8 rounded-2xl" />
          </>
        )}
      </div>
    </Layout>
  )
}
