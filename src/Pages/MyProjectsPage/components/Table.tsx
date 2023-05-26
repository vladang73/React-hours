import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ThreeBounce } from 'better-react-spinkit'
import classNames from 'classnames'
import { useAxios } from 'Lib'
import EditHours from './EditHours'
import ReactTooltip from 'react-tooltip'

export default function Table({
  data,
  tableDataIsLoading,
  totalHours,
  dates,
  username,
  fetchTableData,
  dayHours,
}) {
  const { t } = useTranslation()
  const axios = useAxios()
  const [editHoursIsOpen, setEditHoursIsOpen] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [hourId, setHourId] = useState()

  const getBtnClass = (btnColor: String) => {
    if (btnColor === 'Orange') return 'hour-btn-yellow'
    else if (btnColor === 'Green') return 'hour-btn-green'
    else if (btnColor === 'Red') return 'hour-btn-red'
    else if (btnColor === 'Blue') return 'hour-btn-blue'
    return 'hour-btn-grey'
  }

  const getBtnIcon = (btnColor: String) => {
    if (btnColor === 'Orange') return <img src="/loading.svg" alt="loading-circle" />
    else if (btnColor === 'Green') return <img src="/double-tick.svg" alt="two-green-checks" />
    else if (btnColor === 'Red') return <img src="/cross.svg" alt="red-cross" />
    else if (btnColor === 'Blue') return <img src="blue-tick.svg" alt="single-blue-check" />
  }

  const openModalAndSetData = (btnColor: String, id: any) => {
    if (btnColor === 'Orange' || btnColor === 'Red') {
      axios
        .get(
          `/api/factory/execute/local/getHoursByIdv2?username=${username}&week=${dates.WeekOfYear}&year=${dates.Year}&id=${id}`
        )
        .then((res) => {
          let modalData = res.data.Items[0]
          setHourId(id)
          setModalData(modalData)
          setEditHoursIsOpen(true)
        })
    }
  }

  return (
    <>
      <div className="table-responsive data-table">
        {!isNaN(totalHours) && totalHours !== 0 && !tableDataIsLoading && (
          <div className="text-right py-3">{`${totalHours} Hours`}</div>
        )}
        <table className="table" style={{ marginBottom: 0 }}>
          <thead>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td className="text-left">{dayHours['Maandag']}</td>
              <td className="text-left">{dayHours['Dinsdag']}</td>
              <td className="text-left">{dayHours['Woensdag']}</td>
              <td className="text-left">{dayHours['Donderdag']}</td>
              <td className="text-left">{dayHours['Vrijdag']}</td>
              <td className="text-left">{dayHours['Zaterdag']}</td>
              <td className="text-left">{dayHours['Zondag']}</td>
              <td></td>
            </tr>
            <tr>
              <th>{t('Project')}</th>
              <th>{t('Phase')}</th>
              <th>{t('Rol')}</th>
              <th>{t('Monday')}</th>
              <th>{t('Tuesday')}</th>
              <th>{t('Wednesday')}</th>
              <th>{t('Thursday')}</th>
              <th>{t('Friday')}</th>
              <th>{t('Saturday')}</th>
              <th>{t('Sunday')}</th>
              <th>{t('Remark')}</th>
            </tr>
          </thead>
          {data && !tableDataIsLoading && (
            <tbody>
              {data?.map((p, i) => (
                <tr key={i}>
                  <td>{p.Project ? p.Project : '-'}</td>
                  <td>{p.Phase ? p.Phase : '-'}</td>
                  <td>{p.Role ? p.Role : '-'}</td>
                  <td>
                    <button
                      className={classNames('hour-btn', getBtnClass(p.buttonTypeMaandag))}
                      data-tip
                      data-for={`maandag-${i}`}
                      onClick={() => {
                        openModalAndSetData(p.buttonTypeMaandag, p.id)
                      }}
                    >
                      {p.Maandag ? (
                        <>
                          {p.Maandag} {getBtnIcon(p.buttonTypeMaandag)}
                        </>
                      ) : (
                        <>0</>
                      )}
                    </button>
                    {p.Maandag && (
                      <ReactTooltip id={`maandag-${i}`} place="top" effect="solid">
                        {p.HoverText}
                      </ReactTooltip>
                    )}
                  </td>
                  <td>
                    <button
                      className={classNames('hour-btn', getBtnClass(p.buttonTypeDinsdag))}
                      data-tip
                      data-for={`dinsdag-${i}`}
                      onClick={() => {
                        openModalAndSetData(p.buttonTypeDinsdag, p.id)
                      }}
                    >
                      {p.Dinsdag ? (
                        <>
                          {p.Dinsdag} {getBtnIcon(p.buttonTypeDinsdag)}
                        </>
                      ) : (
                        <>0</>
                      )}
                    </button>
                    {p.Dinsdag && (
                      <ReactTooltip id={`dinsdag-${i}`} place="top" effect="solid">
                        {p.HoverText}
                      </ReactTooltip>
                    )}
                  </td>
                  <td>
                    <button
                      className={classNames('hour-btn', getBtnClass(p.buttonTypeWoensdag))}
                      data-tip
                      data-for={`woensdag-${i}`}
                      onClick={() => {
                        openModalAndSetData(p.buttonTypeWoensdag, p.id)
                      }}
                    >
                      {p.Woensdag ? (
                        <>
                          {p.Woensdag} {getBtnIcon(p.buttonTypeWoensdag)}
                        </>
                      ) : (
                        <>0</>
                      )}
                    </button>
                    {p.Woensdag && (
                      <ReactTooltip id={`woensdag-${i}`} place="top" effect="solid">
                        {p.HoverText}
                      </ReactTooltip>
                    )}
                  </td>
                  <td>
                    <button
                      className={classNames('hour-btn', getBtnClass(p.buttonTypeDonderdag))}
                      data-tip
                      data-for={`donderdag-${i}`}
                      onClick={() => {
                        openModalAndSetData(p.buttonTypeDonderdag, p.id)
                      }}
                    >
                      {p.Donderdag ? (
                        <>
                          {p.Donderdag} {getBtnIcon(p.buttonTypeDonderdag)}
                        </>
                      ) : (
                        <>0</>
                      )}
                    </button>
                    {p.Donderdag && (
                      <ReactTooltip id={`donderdag-${i}`} place="top" effect="solid">
                        {p.HoverText}
                      </ReactTooltip>
                    )}
                  </td>
                  <td>
                    <button
                      className={classNames('hour-btn', getBtnClass(p.buttonTypeVrijdag))}
                      data-tip
                      data-for={`vrijdag-${i}`}
                      onClick={() => {
                        openModalAndSetData(p.buttonTypeVrijdag, p.id)
                      }}
                    >
                      {p.Vrijdag ? (
                        <>
                          {p.Vrijdag} {getBtnIcon(p.buttonTypeVrijdag)}
                        </>
                      ) : (
                        <>0</>
                      )}
                    </button>
                    {p.Vrijdag && (
                      <ReactTooltip id={`vrijdag-${i}`} place="top" effect="solid">
                        {p.HoverText}
                      </ReactTooltip>
                    )}
                  </td>
                  <td>
                    <button
                      className={classNames('hour-btn', getBtnClass(p.buttonTypeZaterdag))}
                      data-tip
                      data-for={`zaterdag-${i}`}
                      onClick={() => {
                        openModalAndSetData(p.buttonTypeZaterdag, p.id)
                      }}
                    >
                      {p.Zaterdag ? (
                        <>
                          {p.Zaterdag} {getBtnIcon(p.buttonTypeZaterdag)}
                        </>
                      ) : (
                        <>0</>
                      )}
                    </button>
                    {p.Zaterdag && (
                      <ReactTooltip id={`zaterdag-${i}`} place="top" effect="solid">
                        {p.HoverText}
                      </ReactTooltip>
                    )}
                  </td>
                  <td>
                    <button
                      className={classNames('hour-btn', getBtnClass(p.buttonTypeZondag))}
                      data-tip
                      data-for={`zondag-${i}`}
                      onClick={() => {
                        openModalAndSetData(p.buttonTypeZondag, p.id)
                      }}
                    >
                      {p.Zondag ? (
                        <>
                          {p.Zondag} {getBtnIcon(p.buttonTypeZondag)}
                        </>
                      ) : (
                        <>0</>
                      )}
                    </button>
                    {p.Zondag && (
                      <ReactTooltip id={`zondag-${i}`} place="top" effect="solid">
                        {p.HoverText}
                      </ReactTooltip>
                    )}
                  </td>
                  <td>{p.Remark}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {tableDataIsLoading && (
          <div
            className="col-md-4 offset-md-4 col-xs-12 text-center loading"
            style={{ textAlign: 'center' }}
          >
            <ThreeBounce size={15} color="#009fe3" />
          </div>
        )}
      </div>
      {modalData && (
        <EditHours
          editHoursIsOpen={editHoursIsOpen}
          closeModal={() => {
            setEditHoursIsOpen(false)
            setModalData(null)
            fetchTableData()
          }}
          hourId={hourId}
          modalData={modalData}
        />
      )}
    </>
  )
}
