import { useTranslation } from 'react-i18next'
import moment from 'moment'

export default function Table({ data }) {
  const { t } = useTranslation()
  return (
    <div className="table-responsive data-table">
      <table className="table">
        <thead>
          <tr>
            <th>{t('Project Code')}</th>
            <th>{t('Date')}</th>
            <th>{t('Phase')}</th>
            <th>{t('Role')}</th>
            <th>{t('Hours')}</th>
            <th>{t('Note')}</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((p, i) => (
            <tr key={i}>
              <td>{p.Project}</td>
              <td>{moment(p.Date, 'YYYY-MM-DD').format('DD-MM-YYYY')}</td>
              <td>{p.Phase ? p.Phase : '-'}</td>
              <td>{p.Role ? p.Role : '-'}</td>
              <td>
                {p.buttonType === 'Green' ? (
                  <button className="hour-btn hour-btn-green">
                    {p.Hours} {t('hours')}
                    <img src="/double-tick.svg" alt="double-ticket" />
                  </button>
                ) : p.buttonType === 'Red' ? (
                  <button className="hour-btn hour-btn-red">
                    {p.Hours} {t('hours')}
                    <img src="/cross.svg" alt="cross" />
                  </button>
                ) : (
                  <button className="hour-btn hour-btn-yellow">
                    {p.Hours} {t('hours')}
                    <img src="/loading.svg" alt="loading" />
                  </button>
                )}
              </td>
              <td>{p.Note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
