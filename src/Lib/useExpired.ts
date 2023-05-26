import dayjs from 'dayjs'

export function useExpired() {
  // const expires_in = useSelector((state: AppState) => state.auth.expires_in)

  function isExpired(timestamp?: string) {
    if (!timestamp) {
      return true
    }

    const last = dayjs(timestamp)
    const now = dayjs()
    const diff = now.diff(last, 'seconds')

    if (diff > 10800) {
      return true
    }

    return false
  }

  return { isExpired }
}
