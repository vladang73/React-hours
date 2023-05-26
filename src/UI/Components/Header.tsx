import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { AppState } from 'App/reducers'
import $ from 'jquery'
import { Link } from 'react-router-dom'

export function Header(props: any) {
  const { i18n } = useTranslation()
  const userName = useSelector((state: AppState) => state.user.userName)

  const [language, setLanguage] = useState({
    value: localStorage.getItem('i18n-friese-poort') === 'en' ? 'en' : 'nl',
    label: localStorage.getItem('i18n-friese-poort') === 'en' ? 'En' : 'Nl',
  })

  const selectLanguage = (val) => {
    setLanguage({
      value: val,
      label: val.toLowerCase(),
    })
    localStorage.setItem('i18n-friese-poort', val)
    i18n.changeLanguage(val)
  }

  return (
    <>
      <header className="header">
        <div
          className="header__burger-btn"
          onClick={(e) => {
            $(e).toggleClass('open')
            $('.sidebar').toggleClass('open')
            $('.menu__link-text-wrap').toggleClass('text-white')
            $('.divider').toggleClass('no-display')
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <Link to="#" className="header__logo-mob">
          <img src="/crow-logo.svg" alt="logo" />
        </Link>
        <div className="header__controls">
          <div className="select mr-3" style={{ maxWidth: '12ch', minWidth: '8ch' }}>
            <select
              id="standard-select"
              value={language?.value || ''}
              onChange={(val) => {
                selectLanguage(val.target.value)
              }}
            >
              <option value="en">En</option>
              <option value="nl">Nl</option>
            </select>
          </div>
          {userName}
        </div>
        <div className="header__user">
          <span className="header__user-name"></span>
        </div>
      </header>
    </>
  )
}
