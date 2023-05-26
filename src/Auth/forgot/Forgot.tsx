import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Axios, { AxiosResponse, AxiosError } from 'axios'
import { AuthTemplate } from 'UI'
import { useTranslation } from 'react-i18next'
import { useIsMounted } from 'Lib'
import { useSelector } from 'react-redux'
import { AppState } from 'App/reducers'
import { Redirect } from 'react-router'
import { LOGIN_URL, HOME_URL } from 'Lib'
import { Link } from 'react-router-dom'

export function ForgotPassword() {
  const { setSafely } = useIsMounted()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccessMessage] = useState<boolean>(false)

  const { register, handleSubmit } = useForm()
  const loggedIn = useSelector((state: AppState) => state.auth.loggedIn)

  if (loggedIn) {
    return <Redirect to={HOME_URL} />
  }

  const axios = Axios.create({
    baseURL: process.env.REACT_APP_API,
  })

  const onSubmit = (data: any) => {
    setSafely(setIsLoading, true)
    axios
      .post(
        `${process.env.REACT_APP_API}/api/accountmanagemnet/SendForgotPasswordEmail?email=${data.email}&resetPasswordBaseUrl=${window.location.origin}/rest-password`
      )
      .then((res: AxiosResponse) => {
        setSafely(setErrorMessage, null)
        setSafely(setIsLoading, false)
        setSafely(setSuccessMessage, true)
      })
      .catch((err: AxiosError) => {
        setSafely(setErrorMessage, err.response?.data.error_description)
        setSafely(setIsLoading, false)
      })
  }

  return (
    <>
      <AuthTemplate
        title="Forgot Password"
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
              <img src="/crow-logo-signin.svg" className="logo" alt="logo" />
            </div>
            <div className="col-md-6 signin-form-holder">
              {success ? (
                <div className="p-5">
                  Bedankt, binnen enkele minuten ontvang je een e-mail met daarin een persoonlijke
                  link. Via de link kun je een nieuw wachtwoord opgeven. Terug naar inloggen
                  <Link to={LOGIN_URL}>(link to login page)</Link>
                </div>
              ) : (
                <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="auth-header">
                    <span>{t('Forgot Password')}</span>
                  </div>
                  <div className="auth-text">
                    <span>{t('Enter your email to receive reset link')}</span>
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
                        {...register('email')}
                      />
                    </div>
                  </div>
                  <div className="auth-btn-holder">
                    <button className="auth-btn">{t('Send Link')}</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </AuthTemplate>
    </>
  )
}
