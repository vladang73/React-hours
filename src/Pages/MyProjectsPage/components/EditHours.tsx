import { Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useMutation } from 'react-query'
import { useAxios } from 'Lib'
import { AddHoursFormData, PhaseItem, RoleItem, ProjectItem } from './types'
import { useState } from 'react'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import 'bootstrap-daterangepicker/daterangepicker.css'
import moment from 'moment'
import Select from 'react-select'
import { useSnackbar } from 'notistack'
import { AxiosError } from 'axios'

export default function EditHours({ editHoursIsOpen, modalData, closeModal, hourId }) {
  console.log('modalData', modalData)
  const { t } = useTranslation()
  const axios = useAxios()
  const { enqueueSnackbar } = useSnackbar()
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      note: modalData.Remark,
      roleid: modalData.Role,
      hours: modalData.Hours,
      date: modalData.Date,
      projectid: modalData.Project,
      phaseid: modalData.Phase,
    },
  })

  const [projectsDropdown, setProjectsDropdown] = useState<ProjectItem[]>([])
  const [phasesDropdown, setPhasesDropdown] = useState<PhaseItem[]>([])
  const [rolesDropdown, setRolesDropdown] = useState<RoleItem[]>([])
  const [projectLabel, setProjectLabel] = useState<any>()
  const [editBtnIsDisabled, setEditBtnIsDisabled] = useState<boolean>(false)
  const [selectedYear, setSelectedYear] = useState<string>(String(moment(new Date()).year()))
  const [phaseRequired, setPhaseRequired] = useState<boolean>(false)

  const getProjectsDropdown = async (): Promise<ProjectItem[]> => {
    const { data } = await axios.get(`/api/factory/execute/local/getProjectsDropdownv2`)
    return data.Items
  }
  useQuery('projects-dropdown', getProjectsDropdown, {
    onSuccess: (data) => {
      setProjectsDropdown(data)
      const item = data.filter((p) => {
        return modalData.ProjectId === p.Id
      })
      setProjectLabel(item[0])
    },
  })

  const setPhases = (selectedPhaseId: any, flag = 'manual'): void => {
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
        if (flag === 'first') {
          reset()
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const getRolesDropdown = async (): Promise<RoleItem[]> => {
    const { data } = await axios.get(`/api/factory/execute/local/getRolesDropdownv2`)
    return data.Items
  }
  useQuery('roles-dropdown', getRolesDropdown, {
    onSuccess: (roles) => {
      setRolesDropdown(roles)
      setPhases(String(modalData.ProjectId), 'first')
      reset()
    },
  })

  const onSubmit = (data) => {
    setEditBtnIsDisabled(true)
    mutationUpdateHours.mutate(data)
  }

  const updateHours = async (params: AddHoursFormData) => {
    let projectIdString = String(params.projectid)
    let temp: any = projectIdString.match(/\d/g)
    temp = temp?.join('')
    params.projectid = temp
    params = {
      ...params,
      id: hourId,
    }
    let data = await axios.post(`/api/factory/execute/local/updateHoursv2`, params)
    return data
  }

  const mutationUpdateHours = useMutation(updateHours, {
    onSuccess: (data) => {
      enqueueSnackbar('Hours updated successfully!', {
        variant: 'success',
      })
      setEditBtnIsDisabled(false)
      closeModal()
    },
    onError: (err: AxiosError) => {
      setEditBtnIsDisabled(false)
      enqueueSnackbar('Reuest Failed!', {
        variant: 'error',
      })
    },
  })

  const removeHours = (): void => {
    axios
      .get(`/api/factory/execute/local/deleteHoursv2?id=${hourId}`)
      .then(({ data }) => {
        closeModal()
      })
      .catch((error) => {
        console.log(error)
      })
  }
  console.log('phase', phaseRequired)
  return (
    <Modal
      show={editHoursIsOpen}
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
                          label: projectLabel.Projectnaam,
                          value: modalData.Project,
                        }}
                        onChange={(val) => {
                          field.onChange(val?.value)
                          setPhases(val?.value)
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
                            value: p.Id,
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
                  render={({ field }) => (
                    <DateRangePicker
                      initialSettings={{
                        locale: {
                          format: 'DD/MM/YYYY',
                        },
                        singleDatePicker: true,
                      }}
                      onApply={(event, picker) => {
                        field.onChange(moment(picker.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD'))
                        setSelectedYear(moment(picker.startDate, 'DD/MM/YYYY').format('YYYY'))
                      }}
                    >
                      <input
                        type="text"
                        className="date-range"
                        defaultValue={moment(modalData.Date, 'YYYY-MM-DD').format('DD/MM/YYYY')}
                      />
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
                <span className="blue-star">*</span>
              </div>
              <div className="select grey-border">
                <select id="standard-select" {...register('phaseid')} required={phaseRequired}>
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
                <select id="standard-select" {...register('roleid')} required>
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
          <button type="submit" className="btn btn-secondary" disabled={editBtnIsDisabled}>
            {t('Edit')}
          </button>
          <button
            className="btn btn-secondary"
            disabled={editBtnIsDisabled}
            onClick={() => removeHours()}
          >
            {t('Delete')}
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}
