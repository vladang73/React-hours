import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { LOGIN_URL } from 'Lib'

export function Sidebar() {
  const { t } = useTranslation()

  const history = useHistory()
  const dispatch = useDispatch()

  const logOut = () => {
    dispatch({ type: 'RESET' })
    history.push(LOGIN_URL)
  }

  return (
    <aside className="sidebar">
      <div className="logo">
        <Link to="#">
          <img title="" className="Logo--desktop" alt="Eijffinger Nederland" src="/crow-logo.svg" />
        </Link>
      </div>
      <div className="divider"></div>
      <nav className="menu">
        <ul className="menu__list">
          <li id="0" className="menu__item">
            <Link to="/overview" className="menu__link menu__link">
              <span
                className={
                  window.location.pathname === '/overview'
                    ? 'menu__link-img-wrap menu__link-active'
                    : 'menu__link-img-wrap'
                }
              >
                {window.location.pathname === '/overview' ? (
                  <>
                    <img src="/overview-white.svg" width="20" height="20" alt="overview-white" />
                  </>
                ) : (
                  <>
                    <img src="/overview-blue.svg" width="20" height="20" alt="overview-blue" />
                  </>
                )}
              </span>
              <span className="menu__link-text-wrap">{t('Overview')}</span>
            </Link>
          </li>
          <li id="1" className="menu__item">
            <Link to="/myprojects" className="menu__link menu__link">
              <span
                className={
                  window.location.pathname === '/myprojects'
                    ? 'menu__link-img-wrap menu__link-active'
                    : 'menu__link-img-wrap'
                }
              >
                {window.location.pathname === '/myprojects' ? (
                  <>
                    <img src="/projects-blue.svg" width="20" height="20" alt="project-white" />
                  </>
                ) : (
                  <>
                    <img src="/projects-white.svg" width="20" height="20" alt="project-white" />
                  </>
                )}
              </span>
              <span className="menu__link-text-wrap">{t('My Projects')}</span>
            </Link>
          </li>
        </ul>
      </nav>
      <nav className="menu logout-menu">
        <ul className="menu__list">
          <li id="4" className="menu__item">
            <Link
              to="#"
              className="menu__link menu__link"
              onClick={() => {
                logOut()
              }}
            >
              <span className="menu__link-img-wrap">
                <img src="/logout.svg" width="20" height="20" alt="logout" />
              </span>
              <span className="menu__link-text-wrap">Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
