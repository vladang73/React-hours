import { useState } from 'react'
import { Redirect } from 'react-router'
import { AuthTemplate } from 'UI'
import Axios, { AxiosResponse, AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { useIsMounted } from 'Lib'
import { useHistory } from 'react-router'
import { LOGIN_URL, HOME_URL } from 'Lib'
import { useSelector } from 'react-redux'
import { AppState } from 'App/reducers'

const ResetPassword = () => {
  const getUrlParameter = (name, url) => {
    name = name.replace(/\[]/, '\\[').replace(/[\]]/, '\\]')
    var regex = new RegExp('[\\?&]' + name + '=([^&]*)')
    var results = regex.exec(url)
    return results === null ? '' : results[1]
  }

  const { setSafely } = useIsMounted()

  const code = getUrlParameter('code', window.location.href)
  const email = getUrlParameter('email', window.location.href)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setErrorMessage] = useState<string | null>(null)
  const { t } = useTranslation()
  const { register, handleSubmit } = useForm()

  const [showPass, setShowPass] = useState<boolean>(false)
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false)

  let history = useHistory()

  const loggedIn = useSelector((state: AppState) => state.auth.loggedIn)
  if (!(code && email) || loggedIn) {
    return <Redirect to={HOME_URL} />
  }

  const axios = Axios.create({
    baseURL: process.env.REACT_APP_API,
  })

  const onSavePassword = (data: any) => {
    setSafely(setIsLoading, true)
    axios
      .post(`${process.env.REACT_APP_API}/api/accountmanagemnet/ResetPassword`, {
        email: email,
        password: data.password,
        confirmpassword: data.confirmpassword,
        code: code,
      })
      .then((res: AxiosResponse) => {
        setSafely(setIsLoading, false)
        localStorage.setItem('pass_updated', 'true')
        history.push(LOGIN_URL)
      })
      .catch((err: AxiosError) => {
        setSafely(setErrorMessage, err.response?.data.error_description)
        setSafely(setIsLoading, false)
        console.error(err)
      })
  }

  return (
    <>
      <AuthTemplate
        title="Reset Password"
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
              <form className="auth-form" onSubmit={handleSubmit(onSavePassword)}>
                <div className="auth-header">
                  <span>{t('Reset Password')}</span>
                </div>
                <div className="auth-text">
                  <span>{t('Enter your new password')}</span>
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
                      alt="/show"
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
                      alt="hidden"
                    />
                  </div>
                </div>
                <div className="password-input-holder" style={{ width: '100%' }}>
                  <div className="password-label">
                    <span>{t('Confirm Password')}</span>
                  </div>
                  <div className="password-input">
                    <input
                      type={showConfirmPass ? 'text' : 'password'}
                      placeholder={t('Confirm Password')}
                      required
                      id="password_field"
                      {...register('confirmpassword')}
                    />
                    <img
                      style={{
                        display: showConfirmPass ? 'none' : 'block',
                      }}
                      onClick={() => {
                        setShowConfirmPass(!showConfirmPass)
                      }}
                      src="/show.svg"
                      id="show-pass"
                      alt="show"
                    />
                    <img
                      style={{
                        display: showConfirmPass ? 'block' : 'none',
                      }}
                      onClick={() => {
                        setShowConfirmPass(!showConfirmPass)
                      }}
                      width="20"
                      height="20"
                      src="/hidden.svg"
                      id="hide-pass"
                      alt="hide"
                    />
                  </div>
                </div>
                <div className="auth-btn-holder">
                  <button className="auth-btn">{t('Reset')}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </AuthTemplate>
    </>
  )
}

export default ResetPassword
