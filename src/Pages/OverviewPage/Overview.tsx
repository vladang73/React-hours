import { useState, useEffect } from 'react'
import { DashboardLayout, Template } from 'UI'
import { Header } from 'UI/Components/Header'
import { useTranslation } from 'react-i18next'
import { useAxios } from 'Lib'
import { useQuery } from 'react-query'
import Chart from './components/Chart'
import Stats from './components/Stats'
import ProjectCard from './components/ProjectCard'
import Table from './components/Table'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import 'bootstrap-daterangepicker/daterangepicker.css'
import moment from 'moment'
import useStats from './components/useStats'
import { useDispatch } from 'react-redux'
import { setRecentSelected } from 'Data/Shared'
import { useHistory } from 'react-router-dom'

export function OverviewPage() {
  const { t } = useTranslation()
  const axios = useAxios()
  const stats = useStats()
  const dispatch = useDispatch()
  const history = useHistory()

  const [recentProjects, setRecentProjects] = useState<any>()
  const [tableData, setTableData] = useState<any>()
  const [startDate, setStartDate] = useState<string>(moment().startOf('month').format('DD/MM/YYYY'))
  const [endDate, setEndDate] = useState<string>(moment().endOf('month').format('DD/MM/YYYY'))

  const getTableDataBetweenRange = async (startDate, endDate) => {
    const { data } = await axios.get(
      `/api/factory/execute/local/getKPIProjectsOverviewv2?startDate=${moment(
        startDate,
        'DD-MM-YYYY'
      ).format('YYYY-MM-DD')}&endDate=${moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD')}`
    )
    setTableData(data.Items)
  }
  useEffect(() => {
    getTableDataBetweenRange(startDate, endDate)
  }, [])

  const getRecentProjects = async () => {
    const { data } = await axios.get(`/api/factory/execute/local/getKPIRecentProjectsv2`)
    return data.Items
  }
  useQuery('recent-projects', getRecentProjects, {
    onSuccess: (recentProjects) => {
      setRecentProjects(recentProjects)
    },
  })

  return (
    <DashboardLayout title={t('Overview')}>
      <Template title={t('Overview')}>
        <div className="col place-page__div">
          <Header />
          <div className="open-order overview-page">
            <Stats
              projectsThisMonth={stats.projectsThisMonth}
              hoursThisMonth={stats.hoursThisMonth}
              newProjects={stats.newProjectsThisMonth}
              allTime={stats.hoursThisYear}
            />
            <div className="projects-overview-heading"></div>
            <div className="row projects-overview-holder" style={{ padding: '0px 10px' }}>
              <div className="col-lg-8 col-md-12 chart-holder" style={{ padding: '30px 40px' }}>
                <Chart />
              </div>
              <div className="col-lg-3 col-md-12 recet-users-holder">
                <div className="heading-text">{t('Recent Projects')}</div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {recentProjects?.map((p, i) => (
                    <ProjectCard
                      onClickHandler={() => {
                        dispatch(
                          setRecentSelected({
                            id: p.id,
                            active: true,
                          })
                        )
                        history.push('/myprojects')
                      }}
                      key={i}
                      name={p.Projectcode}
                      time={p.DateCreated}
                      hours={2}
                      buttonType="Green"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="table-wrapper">
              <div className="heading-daterange-holder">
                <div className="projects-over-view-heading">{t('Projects Overview')}</div>
                <div className="">
                  <div className="select grey-border custom-date-holder" style={{ border: 'none' }}>
                    <img className="pl-10" src="/calender.svg" alt="calender" />
                    <DateRangePicker
                      initialSettings={{
                        locale: {
                          format: 'DD/MM/YYYY',
                        },
                        startDate: startDate,
                        endDate: endDate,
                      }}
                      onApply={(event, picker) => {
                        setStartDate(picker.startDate)
                        setEndDate(picker.endDate)
                        getTableDataBetweenRange(picker.startDate, picker.endDate)
                      }}
                    >
                      <input className="date-range" type="text" />
                    </DateRangePicker>
                  </div>
                </div>
              </div>

              <div className="table-holder">
                <Table data={tableData} />
              </div>
            </div>
          </div>
        </div>
      </Template>
    </DashboardLayout>
  )
}
