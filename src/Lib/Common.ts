import $ from 'jquery'

export const hideSlideForm = () => {
  $('.fade-display').toggleClass('fade modal-backdrop show')
  return true
}
export const showSlideForm = () => {
  $('.fade-display').toggleClass('fade modal-backdrop show')
  return true
}

export const getPaginationData = (pageSize: number, page: number, data: any[]) => {
  const tem_data = Object.assign([], data)
  const firstIndex = (page - 1) * pageSize
  const secondIndex = pageSize * page
  let result = tem_data.slice(firstIndex, secondIndex)
  return result
}
