import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAxios } from 'Lib'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { AppState } from 'App/reducers'
import { DashboardLayout, Template } from 'UI'
import { Header } from 'UI/Components/Header'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import 'bootstrap-daterangepicker/daterangepicker.css'
import moment from 'moment'
import Table from './components/Table'
import AddHours from './components/AddHours'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { setRecentSelected } from 'Data/Shared'

export function MyProjects() {
  const { t } = useTranslation()
  const axios = useAxios()
  const dispatch = useDispatch()
  const userName = useSelector((state: AppState) => state.user.userName)
  const { recentSelected } = useSelector((state: any) => state.shared)
  const [search, setSearch] = useState<string>('')
  const [tableData, setTableData] = useState<any>()
  const [totalHours, setTotalHours] = useState<number>(0)
  const [dayHours, setDayHours] = useState<any>([])
  const [tableDataIsLoading, setTableDataIsLoading] = useState<boolean>()
  const [addHoursIsOpen, setAddHoursIsOpen] = useState<boolean>(false)
  const [sendMyHoursStatus, setSendMyHoursStatus] = useState<boolean>()

  const [dates, setDates] = useState<any>(undefined)

  useEffect(() => {
    if (recentSelected.id && recentSelected.active) {
      setAddHoursIsOpen(true)
      dispatch(
        setRecentSelected({
          ...recentSelected,
          active: false,
        })
      )
    }
  }, [])

  useEffect(() => {
    setTableDataIsLoading(true)
    fetchTableData()
    axios
      .get(
        `/api/factory/execute/local/checkSubmitHoursStatusv2?week=${dates?.WeekOfYear}&year=${dates?.Year}&username=${userName}`
      )
      .then((res) => {
        const submitHoursStatus = res.data.Items[0]?.SubmitHours
        setSendMyHoursStatus(submitHoursStatus === 'Inactive' ? true : false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [dates])

  const checkSubmitHoursStatus = () => {
    axios
      .get(
        `/api/factory/execute/local/checkSubmitHoursStatusv2?week=${dates?.WeekOfYear}&year=${dates?.Year}&username=${userName}`
      )
      .then((res) => {
        const submitHoursStatus = res.data.Items[0]?.SubmitHours
        setSendMyHoursStatus(submitHoursStatus === 'Inactive' ? true : false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const fetchTableData = () => {
    axios
      .get(
        `/api/factory/execute/local/getHoursByWeekv2?userName=${userName}&year=${dates?.Year}&week=${dates?.WeekOfYear}`
      )
      .then(({ data }) => {
        setTableDataIsLoading(false)
        const itemData = data.Items
        let tempData: any = []
        let tempTotalHours = 0
        let temDayHours: any = []
        temDayHours['Maandag'] = 0
        temDayHours['Dinsdag'] = 0
        temDayHours['Woensdag'] = 0
        temDayHours['Donderdag'] = 0
        temDayHours['Vrijdag'] = 0
        temDayHours['Zaterdag'] = 0
        temDayHours['Zondag'] = 0
        itemData.map((p, index) => {
          let totalHours = 0
          if (
            p?.Maandag !== undefined &&
            p?.Dinsdag !== undefined &&
            p?.Woensdag !== undefined &&
            p?.Donderdag !== undefined &&
            p?.Vrijdag !== undefined &&
            p?.Zaterdag !== undefined &&
            p?.Zondag !== undefined
          ) {
            totalHours =
              p?.Maandag +
              p?.Dinsdag +
              p?.Woensdag +
              p?.Donderdag +
              p?.Vrijdag +
              p?.Zaterdag +
              p?.Zondag +
              1 -
              1
          }
          if (totalHours !== 0) {
            tempData.push(p)
            tempTotalHours = tempTotalHours + totalHours
          }

          if (p?.Maandag !== undefined) {
            temDayHours['Maandag'] = temDayHours['Maandag'] + p?.Maandag
          }
          if (p?.Dinsdag !== undefined) {
            temDayHours['Dinsdag'] = temDayHours['Dinsdag'] + p?.Dinsdag
          }
          if (p?.Woensdag !== undefined) {
            temDayHours['Woensdag'] = temDayHours['Woensdag'] + p?.Woensdag
          }
          if (p?.Donderdag !== undefined) {
            temDayHours['Donderdag'] = temDayHours['Donderdag'] + p?.Donderdag
          }
          if (p?.Vrijdag !== undefined) {
            temDayHours['Vrijdag'] = temDayHours['Vrijdag'] + p?.Vrijdag
          }
          if (p?.Zaterdag !== undefined) {
            temDayHours['Zaterdag'] = temDayHours['Zaterdag'] + p?.Zaterdag
          }
          if (p?.Zondag !== undefined) {
            temDayHours['Zondag'] = temDayHours['Zondag'] + p?.Zondag
          }
          return p
        })
        setTotalHours(tempTotalHours)
        setTableData(tempData)
        setDayHours(temDayHours)
      })
      .catch((error) => {
        setTableDataIsLoading(false)
        console.log(error)
      })
  }

  const submitHours = async () => {
    const { data } = await axios.get(
      `/api/factory/execute/local/submitHoursv2?week=${dates.WeekOfYear}&year=${dates.Year}&username=${userName}`
    )
    if (data.Success) {
      fetchTableData()
    }
  }

  // Calls for Dates
  const getCurrentWeekDates = async () => {
    const { data } = await axios.get(`/api/factory/execute/local/getCurrentWeekDatesv2`)
    return data.Items[0]
  }
  useQuery('current-week-dates', getCurrentWeekDates, {
    onSuccess: (data) => {
      setDates(data)
    },
  })

  const getWeekDatesbyDate = async (date) => {
    const { data } = await axios.get(
      `/api/factory/execute/local/getWeekDatesByDatev2?date=${moment(date, 'DD-MM-YYYY').format(
        'YYYY-MM-DD'
      )}`
    )
    setDates(data.Items[0])
  }

  const getWeekDatesNext = async () => {
    if (dates.WeekOfYear === 52) {
      const { data } = await axios.get(
        `/api/factory/execute/local/getWeekDatesNextv2?week=${1}&year=${Number(dates.Year) + 1}`
      )
      setDates(data.Items[0])
    } else {
      const { data } = await axios.get(
        `/api/factory/execute/local/getWeekDatesNextv2?week=${dates.WeekOfYear}&year=${dates.Year}`
      )
      setDates(data.Items[0])
    }
  }

  const getWeekDatesPrev = async () => {
    if (dates.WeekOfYear === 2) {
      const { data } = await axios.get(
        `/api/factory/execute/local/getWeekDatesPreviousv2?week=${1}&year=${Number(dates.Year)}`
      )
      setDates(data.Items[0])
    } else {
      const { data } = await axios.get(
        `/api/factory/execute/local/getWeekDatesPreviousv2?week=${dates.WeekOfYear}&year=${dates.Year}`
      )
      setDates(data.Items[0])
    }
  }

  return (
    <DashboardLayout title={t('My Projects')}>
      <Template title={t('My Projects')}>
        <div className="col place-page__div">
          <Header search={search} setSearch={setSearch} />
          <div className="open-order myprojects-page">
            <div className="content__header">
              <div className="sort-by-holder">
                <h2 className="title">{t('Projects')}</h2>
                <div className="next-prev" onClick={getWeekDatesPrev}>
                  {'<'}
                </div>
                {dates && (
                  <div className="select custom-date-holder" style={{ border: 'none' }}>
                    <img className="pl-10" src="/calender.svg" alt="calender" />
                    <DateRangePicker
                      initialSettings={{
                        locale: {
                          format: 'DD/MM/YYYY',
                        },
                        singleDatePicker: true,
                      }}
                      onApply={(event, picker) => {
                        getWeekDatesbyDate(picker.startDate)
                      }}
                    >
                      <button className="date-range">{`${dates.Date}`}</button>
                    </DateRangePicker>
                  </div>
                )}
                <div className="next-prev" onClick={getWeekDatesNext}>
                  {'>'}
                </div>
                <div className="filter-and-add-btn-holder ml-4">
                  <button
                    className={classNames(
                      'filter-btn',
                      sendMyHoursStatus ? 'filter-btn-disabled' : ''
                    )}
                    type="button"
                    disabled={sendMyHoursStatus}
                    onClick={submitHours}
                  >
                    {t('Send my Hours')}
                  </button>
                </div>
              </div>
              <div className="filter-and-add-btn-holder">
                <button
                  className="add-hours-btn"
                  type="button"
                  data-toggle="modal"
                  data-target="#add-hoursModal"
                  onClick={() => {
                    setAddHoursIsOpen(true)
                  }}
                >
                  + {t('Add Hours')}
                </button>
                {addHoursIsOpen && (
                  <AddHours
                    openAddHours={addHoursIsOpen}
                    closeModal={() => {
                      setAddHoursIsOpen(false)
                      checkSubmitHoursStatus()
                      fetchTableData()
                      dispatch(
                        setRecentSelected({
                          id: undefined,
                          active: false,
                        })
                      )
                    }}
                    projectId={recentSelected.id}
                    dates={dates}
                  />
                )}
              </div>
            </div>

            <div className="table-holder">
              <Table
                data={tableData}
                tableDataIsLoading={tableDataIsLoading}
                totalHours={totalHours}
                dates={dates}
                username={userName}
                fetchTableData={fetchTableData}
                dayHours={dayHours}
              />
            </div>
          </div>
        </div>
      </Template>
    </DashboardLayout>
  )
}
