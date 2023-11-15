import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AdminProps {
  admin: {
    uid: string
    email: string
  }
}

const initialState: AdminProps = {
  admin: { email: '', uid: '' },
}

const adminSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    handleSetAdmin(state, action: PayloadAction<AdminProps>) {
      state.admin = action.payload.admin
    },
  },
})

export const { handleSetAdmin } = adminSlice.actions

export default adminSlice.reducer
