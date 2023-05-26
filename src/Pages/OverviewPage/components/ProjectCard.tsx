import { useTranslation } from 'react-i18next'

export default function ProjectCard({ name, time, hours, buttonType, onClickHandler }) {
  const { t } = useTranslation()
  return (
    <div className="card-holder" onClick={onClickHandler} style={{ cursor: 'pointer' }}>
      <div className="text-holder">
        <div className="name">{name}</div>
        <div className="time">{time}</div>
      </div>
      <div className="btn-holder">
        {buttonType === 'Green' ? (
          <button className="hour-btn hour-btn-green">
            {hours} {t('hours')}
            <img src="/double-tick.svg" alt="double-tick" />
          </button>
        ) : buttonType === 'Red' ? (
          <button className="hour-btn hour-btn-red">
            {hours} {t('hours')}
            <img src="/cross.svg" alt="cross" />
          </button>
        ) : (
          <button className="hour-btn hour-btn-yellow">
            {hours} {t('hours')}
            <img src="/loading.svg" alt="loading" />
          </button>
        )}
      </div>
    </div>
  )
}
