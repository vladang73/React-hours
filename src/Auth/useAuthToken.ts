import { useSelector, useDispatch } from 'react-redux'
import { AppState } from 'App/reducers'
import { refreshTimestamp } from 'Data/Auth'

interface UseTokenResponse {
  token: string
  refresh: () => void
}

export default function useAuthToken(): UseTokenResponse {
  const isUserLogin = useSelector((state: AppState) => state.auth.loggedIn)
  const userToken = useSelector((state: AppState) => state.auth.token)
  const dispatch = useDispatch()

  const refreshAuth = () => {
    dispatch(refreshTimestamp(''))
  }

  if (isUserLogin) {
    return { token: userToken, refresh: refreshAuth }
  }

  return { token: 'no-token-present', refresh: () => {} }
}
