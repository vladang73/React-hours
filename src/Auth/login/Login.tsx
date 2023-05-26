import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Axios, { AxiosResponse, AxiosError } from 'axios'
import { setLogin, refreshTimestamp, setExpiresIn } from 'Data/Auth'
import { setUser, setUserRoles } from 'Data/User'
import { AuthTemplate } from 'UI'
import { FormDataItem, FetchLoginDataResponse } from './types'
import { useIsMounted, HOME_URL } from 'Lib'
import { useSnackbar } from 'notistack'
import { useTranslation } from 'react-i18next'
import './styles.scss'

export function Login() {
  const { t } = useTranslation()
  const history = useHistory()
  const dispatch = useDispatch()
  const { setSafely } = useIsMounted()
  const { enqueueSnackbar } = useSnackbar()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setErrorMessage] = useState<string | null>(null)
  const [showPass, setShowPass] = useState<boolean>(false)

  if (localStorage.getItem('pass_updated') === 'true') {
    enqueueSnackbar(t('Your password has been successfully updated'), {
      variant: 'success',
    })
    localStorage.removeItem('pass_updated')
  }

  const config = {
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  }
  const axios = Axios.create({
    baseURL: process.env.REACT_APP_API,
  })

  const { register, handleSubmit } = useForm()

  const storeLoginData = (loginData: FetchLoginDataResponse) => {
    dispatch(setLogin(loginData.access_token))
    dispatch(refreshTimestamp(''))
    dispatch(setExpiresIn(loginData.expires_in))
    dispatch(setUser(loginData.userName))
    dispatch(setUserRoles(loginData.roles))
  }

  const onSubmit = (data: FormDataItem) => {
    setSafely(setIsLoading, true)
    const params = new URLSearchParams()
    params.append('grant_type', 'password')
    params.append('userName', data.userName)
    params.append('password', data.password)

    axios
      .post('/token', params, config)
      .then((res: AxiosResponse) => {
        const data = res.data as FetchLoginDataResponse
        storeLoginData(data)
        setSafely(setErrorMessage, null)
        setSafely(setIsLoading, false)
        history.push(HOME_URL)
        return
      })
      .catch((err: AxiosError) => {
        setSafely(setErrorMessage, err.response?.data.error_description)
        setSafely(setIsLoading, false)
      })
  }

  return (
    <>
      <AuthTemplate
        title="Login"
        isLoading={isLoading}
        isError={error !== null}
        errorMessage={error ?? ''}
      >
        <div className="container-fluid" style={{ position: 'relative' }}>
          <div className="row">
            <div
              className="col-md-6 logo-holder"
              style={{
                backgroundImage: `url('/sign-in-background.svg')`,
              }}
            >
              <img src="/crow-logo-signin.svg" className="logo" alt="crow-logo" />
            </div>
            <div className="col-md-6 signin-form-holder">
              <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="auth-header">
                  <span>{t('Sign In')}</span>
                </div>
                <div className="auth-text">
                  <span>{t('Sign in if you have an account here')}</span>
                </div>
                <div className="email-input-holder">
                  <div className="email-label">
                    <span>{t('Email')}</span>
                  </div>
                  <div className="email-input">
                    <input
                      type="email"
                      placeholder={t('Email')}
                      required
                      {...register('userName')}
                    />
                  </div>
                </div>
                <div className="password-input-holder" style={{ width: '100%' }}>
                  <div className="password-label">
                    <span>{t('Password')}</span>
                  </div>
                  <div className="password-input">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder={t('Password')}
                      required
                      id="password_field"
                      {...register('password')}
                    />
                    <img
                      style={{
                        display: showPass ? 'none' : 'block',
                      }}
                      onClick={() => {
                        setShowPass(!showPass)
                      }}
                      src="/show.svg"
                      id="show-pass"
                      alt="show"
                    />
                    <img
                      style={{
                        display: showPass ? 'block' : 'none',
                      }}
                      onClick={() => {
                        setShowPass(!showPass)
                      }}
                      width="20"
                      height="20"
                      src="/hidden.svg"
                      id="hide-pass"
                      alt="hide"
                    />
                  </div>
                </div>
                <div className="forgot-password-holder">
                  <Link to="/forgot-password">
                    <span>{t('Forgot Password?')}</span>
                  </Link>
                </div>
                <div className="auth-btn-holder">
                  <button className="auth-btn">{t('Login')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AuthTemplate>
    </>
  )
}
