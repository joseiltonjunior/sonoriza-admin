import { IoHeart, IoPerson, IoPlay } from 'react-icons/io5'
import colors from 'tailwindcss/colors'
import { Select } from '../form/Select'
import { useCallback, useMemo } from 'react'

import { useToast } from '@/hooks/useToast'
import { ReduxProps } from '@/storage'
import { useDispatch, useSelector } from 'react-redux'
import { UsersProps, handleSetUsers } from '@/storage/modules/users/reducer'

import { api } from '@/services/api'
import { UserDataProps } from '@/types/userProps'

export function Users() {
  const { showToast } = useToast()
  const dispatch = useDispatch()

  const { users } = useSelector<ReduxProps, UsersProps>((state) => state.users)

  const plainOptions = useMemo(() => {
    return [
      { label: 'Select', value: '' },
      { label: 'Active', value: 'ACTIVE' },
      { label: 'Disabled', value: 'SUSPENDED' },
    ]
  }, [])

  const handleChangeUserStts = useCallback(
    async (userId: string, isStatus: string) => {      
      try {
        await api.patch(`/users/${userId}/status`, {
          accountStatus: isStatus,
        })

        const usersResponse = await api.get('/users')

        dispatch(
          handleSetUsers({ users: usersResponse.data.data as UserDataProps[] }),
        )

        showToast('User plan updated successfully', {
          type: 'success',
          theme: 'light',
        })
      } catch (error) {
        showToast(`Error updating user plan`, {
          type: 'error',
          theme: 'light',
        })
      }
    },
    [dispatch, showToast],
  )

  const handleCopyClick = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      showToast('Text copied to clipboard', {
        type: 'success',
        theme: 'light',
      })
    } catch (err) {
      showToast('Error copying to clipboard', {
        type: 'warning',
        theme: 'light',
      })
    }
  }

  return (
    <>
      {users.map((user) => (
        <div
          key={user.id}
          className={`bg-white rounded-2xl p-7 mt-8 top-5 flex gap-12 justify-between items-center border hover:border-gray-300 w-full `}
        >
          <div className="flex items-center gap-6">
            <div className="bg-gray-700 w-16 h-16 rounded-full overflow-hidden">
              {user.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt="user photo profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 flex items-center justify-center">
                  <IoPerson size={30} color={colors.white} />
                </div>
              )}
            </div>
            <div className="items-start flex flex-col ">
              <p className="font-bold text-purple-600 text-lg">
                {user.displayName}
              </p>

              <p>{user.email}</p>

              <div className="flex gap-2">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  title="Streams"
                >
                  <IoPlay color={colors.blue[600]} />
                  <p className="font-semibold">{0}</p>
                </div>

                <div
                  className="flex items-center gap-1 cursor-pointer"
                  title="Favorites Musics"
                >
                  <IoHeart color={colors.red[600]} />
                  <p className="font-semibold">
                    {user.favoritesMusics?.length ?? 0}
                  </p>
                </div>

                <div
                  className="flex items-center gap-1 cursor-pointer"
                  title="Favorites Artists"
                >
                  <IoPerson color={colors.green[600]} />
                  <p className="font-semibold">
                    {user.favoritesArtists?.length ?? 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Select
            label="Status"
            options={plainOptions}
            onChange={(e) => handleChangeUserStts(user.id, e.currentTarget.value)}
            value={user.accountStatus}
          />

          {user.tokenFcm && (
            <button
              title="copy token"
              onClick={() => handleCopyClick(user.tokenFcm)}
            >
              <strong>Token FCM</strong>
            </button>
          )}
        </div>
      ))}
    </>
  )
}
