import { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useAxios } from 'Lib'
import { useQuery, useMutation } from 'react-query'
import { useForm, Controller } from 'react-hook-form'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import 'bootstrap-daterangepicker/daterangepicker.css'
import moment from 'moment'
import { AddHoursFormData, PhaseItem, RoleItem, ProjectItem } from './types'
import { AxiosError } from 'axios'
import { useSelector } from 'react-redux'
import { AppState } from 'App/reducers'
import { useSnackbar } from 'notistack'
import Select, { components } from 'react-select'
import Sweetalert from 'sweetalert'

export default function AddHours({ openAddHours, closeModal, projectId, dates }) {
  const { t } = useTranslation()
  const axios = useAxios()
  const { register, handleSubmit, control, reset, setValue } = useForm({
    defaultValues: {
      note: '',
      roleid: 1,
      hours: null,
      date: dates?.DefaultDate
        ? moment(dates?.DefaultDate).format('YYYY-MM-DD')
        : moment().startOf('week').add('days', 1).format('YYYY-MM-DD'),
      projectid: projectId ? projectId : null,
      phaseid: '0',
    },
  })
  const { enqueueSnackbar } = useSnackbar()
  const userName = useSelector((state: AppState) => state.user.userName)

  const [projectsDropdown, setProjectsDropdown] = useState<ProjectItem[]>([])
  const [phasesDropdown, setPhasesDropdown] = useState<PhaseItem[]>([])
  const [rolesDropdown, setRolesDropdown] = useState<RoleItem[]>([])
  const [projectLabel, setProjectLabel] = useState<any>()
  const [openHours, setOpenHours] = useState<number>(0)
  const [selectedYear, setSelectedYear] = useState<string>(String(moment(new Date()).year()))
  const [selectedPhaseId, setSelectedPhaseId] = useState<number>(0)
  const [roleId, setRoleId] = useState<number>(0)
  const [phaseRequired, setPhaseRequired] = useState<boolean>(false)

  useEffect(() => {
    setPhases(selectedPhaseId, selectedYear)
  }, [selectedPhaseId, selectedYear])

  const onSubmit = (data: AddHoursFormData) => {
    mutationAddHours.mutate(data)
  }

  const addHours = async (params: AddHoursFormData) => {
    params = {
      ...params,
      username: userName,
      phaseid: params.phaseid === 'undefined' ? '' : params.phaseid,
    }
    console.log('params', params)
    const checkHourParams = {
      username: userName,
      date: params.date,
      hours: params.hours,
    }
    const { data } = await axios.post(
      `/api/factory/execute/local/checkHoursWrittenv2`,
      checkHourParams
    )
    if (data?.Items[0]['showError'] === 'true') {
      Sweetalert(t('Error'), {
        icon: 'error',
        text: data?.Items[0]['errorMessage'],
      })
      return false
    } else {
      let result = await axios.post(`/api/factory/execute/local/postHoursv2`, params)
      return result
    }
  }

  const mutationAddHours = useMutation(addHours, {
    onSuccess: (data: any) => {
      closeModal()
      reset()
      if (data) {
        enqueueSnackbar('Hours added successfully!', {
          variant: 'success',
        })
      }
    },
    onError: (err: AxiosError) => {
      enqueueSnackbar('Reuest Failed!', {
        variant: 'error',
      })
    },
  })

  const getProjectsDropdown = async (): Promise<ProjectItem[]> => {
    const { data } = await axios.get(`/api/factory/execute/local/getProjectsDropdownv2`)
    return data.Items
  }

  const getRolesDropdown = async (): Promise<RoleItem[]> => {
    const { data } = await axios.get(`/api/factory/execute/local/getRolesDropdownv2`)
    setRoleId(data?.Items[0].Id)
    return data.Items
  }

  useQuery('projects-dropdown', getProjectsDropdown, {
    onSuccess: (data) => {
      setProjectsDropdown(data)
      if (projectId) {
        const item = data.filter((p) => {
          return projectId === p.versieid
        })
        setProjectLabel(item[0])
        // setPhases(item[0]?.versieid)
        setSelectedPhaseId(item[0]?.versieid)
      }
    },
  })

  const setPhases = (selectedPhaseId: number, selectedYear: string): void => {
    axios
      .get(
        `/api/factory/execute/local/getFasesDropdownv2?projectid=${selectedPhaseId}&year=${selectedYear}`
      )
      .then(({ data }) => {
        const selectedProject = projectsDropdown.find((p) => p.versieid === selectedPhaseId)
        if (selectedProject) {
          if (selectedProject?.faseRequired !== 'false') setPhaseRequired(true)
          else setPhaseRequired(false)
        }
        setPhasesDropdown(data?.Items)
        onChangeOpenHours(String(data?.Items[0]?.Id), roleId)
        setValue('phaseid', String(data?.Items[0]?.Id))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useQuery('roles-dropdown', getRolesDropdown, {
    onSuccess: (roles) => {
      setRolesDropdown(roles)
    },
  })

  const DropdownIndicator = (props) => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <img src="/down-arrow.png" className="mr-2" width="11" height="7" alt="down-arrow" />
        </components.DropdownIndicator>
      )
    )
  }

  const onChangeOpenHours = (faseId, roleId) => {
    axios
      .get(
        `/api/factory/execute/local/checkHoursOpen?faseid=${
          faseId !== 'undefined' ? faseId : 0
        }&rolid=${roleId}`
      )
      .then(({ data }) => {
        if (data?.Items[0]) setOpenHours(data?.Items[0]['OpenHours'])
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <>
      <Modal
        show={openAddHours}
        animation={true}
        contentClassName="add-hours-modal"
        dialogClassName="modal-dialog modal-dialog-centered modal-lg"
      >
        <Modal.Header style={{ border: 'none' }} className="add-hours-modal-header">
          <h5 className="modal-title">{t('Add Hours')}</h5>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={() => {
              closeModal()
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body className="add-hours-modal-body">
            <div className="row">
              <div className="col-md-7">
                <div>
                  <span className="grey-label">{t('Choose Project')}</span>
                  <span className="blue-star">*</span>
                </div>
                <div style={{ marginTop: 10 }}>
                  {projectLabel && (
                    <Controller
                      control={control}
                      name="projectid"
                      render={({ field }) => (
                        <Select
                          defaultValue={{
                            label: projectId ? projectLabel?.Projectnaam : '',
                            value: projectId ? projectLabel?.versieid : '',
                          }}
                          onChange={(val) => {
                            field.onChange(val?.value)
                            // setPhases(val?.value)
                            setSelectedPhaseId(val?.value)
                          }}
                          components={{
                            DropdownIndicator,
                          }}
                          styles={{
                            option: (provided) => ({
                              ...provided,
                            }),
                            control: (provided) => ({
                              ...provided,
                              border: '1px solid #dbe3ea;',
                              borderRadius: 10,
                              padding: '7.25px 0px',
                              fontSize: 14,
                              color: '#1b2559',
                            }),
                          }}
                          options={projectsDropdown.map((p) => {
                            return {
                              label: p.Projectnaam,
                              value: p.versieid,
                            }
                          })}
                        />
                      )}
                    />
                  )}
                  {!projectLabel && (
                    <Controller
                      control={control}
                      name="projectid"
                      render={({ field }) => (
                        <Select
                          defaultValue={{
                            label: projectId ? projectLabel?.Projectnaam : '',
                            value: projectId ? projectLabel?.versieid : '',
                          }}
                          onChange={(val) => {
                            field.onChange(val?.value)
                            // setPhases(val?.value)
                            setSelectedPhaseId(val?.value)
                          }}
                          components={{
                            DropdownIndicator,
                          }}
                          styles={{
                            option: (provided) => ({
                              ...provided,
                            }),
                            control: (provided) => ({
                              ...provided,
                              border: '1px solid #dbe3ea;',
                              borderRadius: 10,
                              padding: '7.25px 0px',
                              fontSize: 14,
                              color: '#1b2559',
                            }),
                          }}
                          options={projectsDropdown.map((p) => {
                            return {
                              label: p.Projectnaam,
                              value: p.versieid,
                            }
                          })}
                        />
                      )}
                    />
                  )}
                </div>
              </div>
              <div className="col-md-5">
                <div>
                  <span className="grey-label">{t('Choose Date')}</span>
                  <span className="blue-star">*</span>
                </div>
                <div className="select custom-date-holder">
                  <img className="pl-10" src="/calender.svg" alt="calender" />
                  <Controller
                    control={control}
                    name="date"
                    defaultValue={
                      dates?.DefaultDate
                        ? moment(dates?.DefaultDate).format('DD/MM/YYYY')
                        : moment().startOf('week').add('days', 1).format('DD/MM/YYYY')
                    }
                    render={({ field }) => (
                      <DateRangePicker
                        initialSettings={{
                          locale: {
                            format: 'DD/MM/YYYY',
                          },
                          singleDatePicker: true,
                          startDate: dates?.DefaultDate
                            ? moment(dates?.DefaultDate).format('DD/MM/YYYY')
                            : moment().startOf('week').add('days', 1).format('DD/MM/YYYY'),
                        }}
                        onApply={(event, picker) => {
                          field.onChange(
                            moment(picker.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
                          )
                          setSelectedYear(moment(picker.startDate, 'DD/MM/YYYY').format('YYYY'))
                        }}
                      >
                        <input type="text" className="date-range" />
                      </DateRangePicker>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-5">
                <div>
                  <span className="grey-label">{t('Choose Phase')}</span>
                </div>
                <div className="select grey-border">
                  <select
                    id="standard-select"
                    {...register('phaseid')}
                    onChange={(val) => onChangeOpenHours(val.target.value, roleId)}
                    required={phaseRequired}
                  >
                    {phasesDropdown?.map((phase) => (
                      <option key={phase.Id} value={phase.Id}>
                        {phase.Naam}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-7">
                <div>
                  <span className="grey-label">{t('Choose Role')}</span>
                  <span className="blue-star">*</span>
                </div>
                <div className="select grey-border">
                  <select
                    id="standard-select"
                    {...register('roleid')}
                    required
                    onChange={(val) => onChangeOpenHours(selectedPhaseId, val.target.value)}
                  >
                    {rolesDropdown?.map((role) => (
                      <option key={role.Id} value={role.Id}>
                        {role.Naam}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-5">
                <div>
                  <span className="grey-label">{t('Enter a hours')}</span>
                  <span className="blue-star">*</span>
                </div>
                <div className="grey-border enter-hours-input-holder">
                  <input
                    className="standard-select enter-hours-input"
                    type="number"
                    max="24"
                    min="0"
                    style={{ width: '100%', border: 'none' }}
                    required
                    {...register('hours')}
                  />
                </div>
              </div>
              <div className="col-md-7 pt-4">
                {phasesDropdown.length > 0 && (
                  <div
                    className={openHours > 0 ? 'green-label' : 'red-label'}
                  >{`Voor deze rol zijn nog ${openHours} uur gebudgetteerd.`}</div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div>
                  <span className="grey-label">{t('Enter a Note')}</span>
                </div>
                <div className="text-area-holder">
                  <textarea required className="text-area" {...register('note')}></textarea>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="add-hours-modal-footer">
            <button type="submit" className="btn btn-secondary">
              {t('Send Request')}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}
