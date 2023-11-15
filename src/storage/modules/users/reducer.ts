import { UserDataProps } from '@/types/userProps'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UsersProps {
  users: UserDataProps[]
}

const initialState: UsersProps = {
  users: [],
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    handleSetUsers(state, action: PayloadAction<UsersProps>) {
      state.users = action.payload.users
    },
  },
})

export const { handleSetUsers } = usersSlice.actions

export default usersSlice.reducer
