export interface FormDataItem {
  userName: string
  password: string
}

export interface FetchLoginDataResponse {
  userName: string
  roles: string
  access_token: string
  expires_in: number
}
