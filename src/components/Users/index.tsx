import { IoHeart, IoPerson, IoPlay } from 'react-icons/io5'
import colors from 'tailwindcss/colors'
import { Select } from '../form/Select'
import { useCallback, useMemo } from 'react'

import { firestore } from '@/services/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useToast } from '@/hooks/useToast'
import { ReduxProps } from '@/storage'
import { useDispatch, useSelector } from 'react-redux'
import { UsersProps, handleSetUsers } from '@/storage/modules/users/reducer'
import { useFirebaseServices } from '@/hooks/useFirebaseServices'

export function Users() {
  const { showToast } = useToast()

  const dispatch = useDispatch()

  const { getUsers } = useFirebaseServices()

  const { users } = useSelector<ReduxProps, UsersProps>((state) => state.users)

  const plainOptions = useMemo(() => {
    return [
      { label: 'Select', value: '' },
      { label: 'Free', value: 'free' },
      { label: 'Premium', value: 'premium' },
    ]
  }, [])

  const handleSetUserPlan = useCallback(
    async (userId: string, newPlan: string) => {
      const usersCollection = 'users'
      const userDocRef = doc(firestore, usersCollection, userId)

      try {
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          await updateDoc(userDocRef, { plan: newPlan })

          const usersResponse = await getUsers()

          dispatch(handleSetUsers({ users: usersResponse }))

          showToast('User plan updated successfully', {
            type: 'success',
            theme: 'light',
          })
        } else {
          showToast('User not found', {
            type: 'warning',
            theme: 'light',
          })
        }
      } catch (error) {
        showToast(`Error updating user plan`, {
          type: 'error',
          theme: 'light',
        })
      }
    },
    [dispatch, getUsers, showToast],
  )

  return (
    <>
      {users.map((user) => (
        <div
          key={user.uid}
          className={`bg-white rounded-2xl p-7 mt-8 top-5 flex gap-12 justify-between items-center border hover:border-gray-300 w-full `}
        >
          <div className="flex items-center gap-6">
            <div className="bg-gray-700 w-16 h-16 rounded-full overflow-hidden">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
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
            label="Plan"
            options={plainOptions}
            onChange={(e) => handleSetUserPlan(user.uid, e.currentTarget.value)}
            value={user.plan ?? 'free'}
          />
        </div>
      ))}
    </>
  )
}
