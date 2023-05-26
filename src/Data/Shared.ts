import { createSlice } from '@reduxjs/toolkit'

interface Shared {
  recentSelected: {
    id: Number | null
    active: boolean
  }
}

const initialState: Shared = {
  recentSelected: {
    id: null,
    active: false,
  },
}

const sharedSlice = createSlice({
  name: 'shared',
  initialState: initialState,
  reducers: {
    setRecentSelected: (state, action) => {
      state.recentSelected = {
        ...action.payload,
      }
    },
  },
})

export const { setRecentSelected } = sharedSlice.actions
export default sharedSlice.reducer
