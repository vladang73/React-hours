import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

interface AuthState {
  loggedIn: boolean
  token: string
  timestamp?: string
  expires_in: number
}

const initialState: AuthState = {
  loggedIn: false,
  token: '',
  expires_in: 0,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setLogin: (state, action) => {
      state.loggedIn = true
      state.token = action.payload
    },
    setExpiresIn: (state, action) => {
      state.expires_in = action.payload
    },
    refreshTimestamp: (state, action) => {
      state.timestamp = dayjs().format()
    },
    logout: (state) => {
      state.loggedIn = false
      state.timestamp = undefined
    },
  },
})

export const { setLogin, logout, refreshTimestamp, setExpiresIn } = authSlice.actions
export default authSlice.reducer
