import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import { createUltimatePagination } from 'react-ultimate-pagination'

function PAGE(props) {
  return (
    <div
      className={!props.isActive ? 'pagination-botton ' : 'pagination-botton active '}
      onClick={props.onClick}
    >
      {props.value}
    </div>
  )
}

function Ellipsis(props) {
  return (
    <div
      className={!props.isActive ? 'pagination-botton ' : 'pagination-botton active '}
      onClick={props.onClick}
      style={{ border: 0 }}
    >
      ...
    </div>
  )
}

function FirstPageLink(props) {
  return null
}

function PreviousPageLink(props) {
  return (
    <div className="pagination-botton previous" onClick={props.onClick}>
      {'Previous'}
    </div>
  )
}

function NextPageLink(props) {
  return (
    <div className="pagination-botton next" onClick={props.onClick}>
      {'Next'}
    </div>
  )
}

function LastPageLink(props) {
  return null
}

const PaginatedPage = createUltimatePagination({
  itemTypeToComponent: {
    PAGE: PAGE,
    ELLIPSIS: Ellipsis,
    FIRST_PAGE_LINK: FirstPageLink,
    PREVIOUS_PAGE_LINK: PreviousPageLink,
    NEXT_PAGE_LINK: NextPageLink,
    LAST_PAGE_LINK: LastPageLink,
  },
})

export function Pagination(props) {
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(20)
  const { recordNum } = props

  let totalPage = 1
  const pageNum = String(recordNum / pageSize)
  if (recordNum % pageSize > 0) {
    totalPage = parseInt(pageNum) ? parseInt(pageNum) + 1 : 1
  } else {
    totalPage = parseInt(pageNum) ? parseInt(pageNum) : 1
  }

  useEffect(() => {
    if (page === 1) $('.pagination-botton.previous').addClass('hiden')
  })

  const onPageChange = (currentPage: number) => {
    if (currentPage === 1) {
      $('.pagination-botton.previous').addClass('hiden')
    } else {
      $('.pagination-botton.previous').removeClass('hiden')
    }
    if (currentPage === totalPage) {
      $('.pagination-botton.next').addClass('hiden')
    } else {
      $('.pagination-botton.next').removeClass('hiden')
    }
    setPage(currentPage)
    getData(pageSize, currentPage)
  }

  const changePageLength = (evt) => {
    setPageSize(evt.target.value)
    setPage(1)
    getData(evt.target.value, 1)
  }

  const getData = (pageSize: number, page: number) => {
    props.getData(Number(pageSize), page)
  }

  return (
    <div className="py-2">
      {recordNum > 0 && (
        <div className="pagination">
          <span className="pagination-info">{'Show'}</span>
          <select
            name="project_table_length"
            aria-controls="project_table"
            className=""
            onChange={(evt) => changePageLength(evt)}
          >
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="pagination-info">Entries</span>
          <div style={{ marginLeft: 'auto', display: 'flex' }}>
            <PaginatedPage
              totalPages={totalPage}
              currentPage={page > totalPage ? 1 : page}
              onChange={(page) => onPageChange(page)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
