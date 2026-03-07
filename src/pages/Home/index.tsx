import AWS from 'aws-sdk'
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

import { UsersProps } from '@/storage/modules/users/reducer'
import { FormArtist } from '@/components/FormArtist'
import { MusicalGenres } from '@/components/MusicalGenres'
import { SignCloudFrontUrl } from '@/components/SignCloudFrontUrl'
import { Graphics } from '@/components/Graphics'
import { Upload } from '@/components/Upload'
import { FormMusicalGenres } from '@/components/FormMusicalGenres'
import { Notifications } from '@/components/Notifications'
import { api } from '@/services/api'
import { MusicalGenresDataProps } from '@/types/musicalGenresProps'
import { MusicResponseProps } from '@/types/musicProps'
import { ArtistsResponseProps } from '@/types/artistsProps'

export function Home() {
  const { showToast } = useToast()
  const { openModal } = useModal()

  const [bucketMetrics, setBucketMetrics] = useState<
    AWS.CloudWatch.GetMetricStatisticsOutput[]
  >([])

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

  const handleFetchUnitObjectsMetric = async () => {
    const cloudwatch = new AWS.CloudWatch()

    const params = {
      MetricName: 'NumberOfObjects',
      Namespace: 'AWS/S3',
      Dimensions: [
        {
          Name: 'BucketName',
          Value: 'sonoriza-media',
        },
        {
          Name: 'StorageType',
          Value: 'AllStorageTypes',
        },
      ],
      StartTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      EndTime: new Date(),
      Period: 3600,
      Statistics: ['Average'],
    }

    const data = await cloudwatch.getMetricStatistics(params).promise()
    return data
  }

  const handleFetchTotalSizeMetric = async () => {
    const cloudwatch = new AWS.CloudWatch()

    const params = {
      MetricName: 'BucketSizeBytes',
      Namespace: 'AWS/S3',
      Dimensions: [
        {
          Name: 'BucketName',
          Value: 'sonoriza-media',
        },
        {
          Name: 'StorageType',
          Value: 'StandardStorage',
        },
      ],
      StartTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      EndTime: new Date(),
      Period: 3600,
      Statistics: ['Average'],
    }

    const data = await cloudwatch.getMetricStatistics(params).promise()
    return data
  }

  useEffect(() => {
    async function handleFetchMetricsAWS() {
      try {
        const responseSize = await handleFetchTotalSizeMetric()

        const responseUnit = await handleFetchUnitObjectsMetric()

        setBucketMetrics([responseSize, responseUnit])
      } catch (error) {
        showToast('Error fetching metric', {
          type: 'error',
          theme: 'colored',
        })
      }
    }

    handleFetchMetricsAWS()
  }, [])

  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true)
        const [musicsResponse, artistsResponse, genresResponse] =
          await Promise.all([
            api.get('/musics'),
            api.get('/artists'),
            api.get('/genres'),
          ])

        dispatch(
          handleTrackListRemote({
            trackListRemote: musicsResponse.data.data as MusicResponseProps[],
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
  }, [dispatch])

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

        {tag === 'graphics' && <Graphics metricsS3={bucketMetrics} />}

        {tag === 'upload' && <Upload />}

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
