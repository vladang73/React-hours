import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { QueryKey } from 'types'
import { useAxios } from 'Lib'

export default function Chart() {
  const { t } = useTranslation()
  const axios = useAxios()
  const [totalHours, setTotalHours] = useState<Number>(0)
  const [overviewData, setOverviewData] = useState<any>()
  const [max, setMax] = useState<any>(undefined)

  const getProjectsOverviewChartData = async () => {
    const { data } = await axios.get(`/api/factory/execute/local/getKPIHoursOverviewv2`)
    return data.Items
  }

  useQuery(QueryKey.overviewChart, getProjectsOverviewChartData, {
    onSuccess: (data) => {
      let sum = 0
      data.forEach((item) => {
        sum = sum + item.Hours
      })
      setTotalHours(sum)
      setOverviewData(data)
      let max = Math.max(...data?.map((item) => item.Hours))
      setMax(max)
    },
  })

  return (
    <>
      <div className="total-projects-heading">{t('Total Projects')}</div>
      <div className="total-projects-text">{totalHours}</div>
      <div>
        {max && (
          <Bar
            data={{
              labels: [
                t('Jan'),
                t('Feb'),
                t('Mar'),
                t('Apr'),
                t('May'),
                t('Jun'),
                t('Jul'),
                t('Aug'),
                t('Sep'),
                t('Oct'),
                t('Nov'),
                t('Dec'),
              ],
              datasets: [
                {
                  label: '',
                  data: overviewData?.map((item) => item.Hours),
                  backgroundColor: overviewData?.map((item) => {
                    if (item.Hours === max) {
                      return '#009FE3'
                    }
                    return '#E9EDF7'
                  }),
                  hoverBackgroundColor: '#009FE3',
                  borderRadius: 8,
                },
              ],
            }}
            height={250}
            options={{
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  display: false,
                  grid: {
                    display: false,
                  },
                },
              },
              plugins: {
                tooltip: {
                  backgroundColor: '#009FE3',
                },
                legend: {
                  display: false,
                },
              },
            }}
            plugins={[
              {
                id: 'horizontalDottedLine',
                beforeDatasetsDraw: (chart, args, options) => {
                  const {
                    ctx,
                    // chartArea: { top, right, bottom, left, width, height },
                    chartArea: { left, width },
                    // scales: { x, y },
                    scales: { y },
                  } = chart
                  ctx.save()
                  ctx.setLineDash([5, 10])
                  ctx.strokeStyle = '#009fe3'
                  ctx.strokeRect(left, y.getPixelForValue(max), width, 0)
                  ctx.restore()
                },
              },
            ]}
          />
        )}
      </div>
    </>
  )
}
