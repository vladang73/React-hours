import { createSlice } from '@reduxjs/toolkit'

interface UserState {
  userName: string
  roles: string[]
}

const initialState: UserState = {
  userName: '',
  roles: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.userName = action.payload
    },
    setUserRoles: (state, action) => {
      state.roles = action.payload
    },
  },
})

export const { setUser, setUserRoles } = userSlice.actions
export default userSlice.reducer
