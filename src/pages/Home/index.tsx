import AWS from 'aws-sdk'
import { Layout } from '@/components/Layout'
import { useToast } from '@/hooks/useToast'

import { useEffect, useMemo, useState } from 'react'

import Skeleton from 'react-loading-skeleton'
import { useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'
import { ReduxProps } from '@/storage'
import { SideMenuProps } from '@/storage/modules/sideMenu/reducer'

import { Button } from '@/components/Button'
import { FormMusic } from '@/components/FormMusic'

import { Users } from '@/components/Users'
import { Artists } from '@/components/Artists'

import { Musics } from '@/components/Musics'
import { getAuth } from 'firebase/auth'

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
import { useFirebaseServices } from '@/hooks/useFirebaseServices'
import { UsersProps, handleSetUsers } from '@/storage/modules/users/reducer'
import { FormArtist } from '@/components/FormArtist'
import { MusicalGenres } from '@/components/MusicalGenres'
import { SignCloudFrontUrl } from '@/components/SignCloudFrontUrl'
import { Graphics } from '@/components/Graphics'
import { Upload } from '@/components/Upload'
import { FormMusicalGenres } from '@/components/FormMusicalGenres'

export function Home() {
  const { showToast } = useToast()
  const { openModal } = useModal()
  const { getArtists, getGenres, getMusics, getUsers } = useFirebaseServices()

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

  const navigate = useNavigate()
  const auth = getAuth()
  const dispatch = useDispatch()

  const { tag } = useSelector<ReduxProps, SideMenuProps>(
    (state) => state.sideMenu,
  )

  const excludePath = ['users', 'graphics', 'signUrl', 'upload']

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

      default:
        return ''
    }
  }, [tag])

  const handleFetchData = async () => {
    try {
      setIsLoading(true)

      const musicsResponse = await getMusics()
      const artistsResponse = await getArtists()
      const musicalGenresResponse = await getGenres()
      const usersResponse = await getUsers()

      dispatch(handleSetArtists({ artists: artistsResponse }))
      dispatch(handleTrackListRemote({ trackListRemote: musicsResponse }))
      dispatch(handleSetMusicalGenres({ musicalGenres: musicalGenresResponse }))
      dispatch(handleSetUsers({ users: usersResponse }))

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      showToast('Error fetching data', {
        type: 'error',
        theme: 'colored',
      })
    }
  }

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

  const handleFetchMetricsAWS = async () => {
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

  useEffect(() => {
    handleFetchMetricsAWS()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        handleFetchData()
      } else {
        navigate('/')
      }
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
