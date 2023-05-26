import { useAxios } from 'Lib'
import { useQueries } from 'react-query'
import { useState } from 'react'
import { StatsProps } from './types'

export default function useStats() {
  const axios = useAxios()

  const [stats, setStats] = useState<StatsProps>({
    projectsThisMonth: 0,
    hoursThisMonth: 0,
    newProjectsThisMonth: 0,
    hoursThisYear: 0,
  })

  const getProjectsThisMonth = async () => {
    const { data } = await axios.get(`/api/factory/execute/local/getKPIProjectsv2`)
    return data.Items[0].ProjectsThisMonth
  }

  const getHoursThisMonth = async () => {
    const { data } = await axios.get(`/api/factory/execute/local/getKPIHoursv2`)
    return data.Items[0].HoursThisMonth
  }

  const getNewProjects = async () => {
    const { data } = await axios.get(`/api/factory/execute/local/getKPINewProjectsv2`)
    return data.Items[0].NewProjectsThisMonth
  }

  const getAllTimeHours = async () => {
    const { data } = await axios.get(`/api/factory/execute/local/getKPIHoursYearv2`)
    return data.Items[0].HoursThisYear
  }

  useQueries([
    {
      queryKey: 'projects-this-month',
      queryFn: getProjectsThisMonth,
      onSuccess: (projectsThisMonth) => {
        setStats({
          ...stats,
          projectsThisMonth: projectsThisMonth,
        })
      },
    },
    {
      queryKey: 'hours-this-month',
      queryFn: getHoursThisMonth,
      onSuccess: (hoursThisMonth) => {
        setStats({
          ...stats,
          hoursThisMonth: hoursThisMonth,
        })
      },
    },
    {
      queryKey: 'new-projects',
      queryFn: getNewProjects,
      onSuccess: (newProjectsThisMonth) => {
        setStats({
          ...stats,
          newProjectsThisMonth: newProjectsThisMonth,
        })
      },
    },
    {
      queryKey: 'all-time-hours',
      queryFn: getAllTimeHours,
      onSuccess: (hoursThisYear) => {
        setStats({
          ...stats,
          hoursThisYear: hoursThisYear,
        })
      },
    },
  ])

  return stats
}
