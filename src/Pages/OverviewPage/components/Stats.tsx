import { useTranslation } from 'react-i18next'

export default function Stats({ projectsThisMonth, hoursThisMonth, newProjects, allTime }) {
  const { t } = useTranslation()

  return (
    <div className="row overview-stats-holder">
      <div className="col-md-3 col-sm-6">
        <div className="projects-this-month-holder">
          <div className="stats-holder">
            <div className="text-header">{t('Project this month')}</div>
            <div className="stats">{projectsThisMonth || 0}</div>
          </div>
          <div className="img-holder">
            <img src="/bar-1.svg" alt="bar-1" />
            <img src="/bar-2.svg" alt="bar-2" />
            <img src="/bar-3.svg" alt="bar-3" />
            <img src="/bar-4.svg" alt="bar-4" />
            <img src="/bar-5.svg" alt="bar-5" />
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6">
        <div className="new-projects-holder">
          <div>
            <img src="/new-projects-icon.svg" style={{ maxWidth: 40 }} alt="new-projects" />
          </div>
          <div className="stats-holder">
            <div className="text-header">{t('Hours this month')}</div>
            <div className="stats">{hoursThisMonth || 0}</div>
          </div>
          <div>
            <img src="/line.svg" alt="line" />
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6">
        <div className="new-users-holder">
          <div>
            <img src="/new-users-icon.svg" style={{ maxWidth: 40 }} alt="new-users-icon" />
          </div>
          <div className="stats-holder">
            <div className="text-header">{t('New Projects')}</div>
            <div className="stats">{newProjects || 0}</div>
          </div>
          <div>
            <img src="/line.svg" alt="line" />
          </div>
        </div>
      </div>
      <div className="col-md-3 col-sm-6">
        <div className="alltime-holder">
          <div className="stats-holder">
            <div className="text-header">{t('All times')}</div>
            <div className="stats">{allTime || 0}</div>
          </div>
          <div>
            <img src="/white-line.svg" alt="white-line" />
          </div>
        </div>
      </div>
    </div>
  )
}
