import React from 'react'
import { Loader } from 'UI/Components'
import { Helmet } from 'react-helmet-async'
import { APP_NAME } from 'Lib'
import { ErrorMessage } from 'UI/Components'

interface Props {
  title: string
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  children: React.ReactNode
}

export function AuthTemplate(props: Props) {
  const { title, isLoading, isError, errorMessage, children } = props

  return (
    <>
      <Helmet>
        <title>
          {title} | {APP_NAME}
        </title>
      </Helmet>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="position-relative">
          {isError && errorMessage !== undefined && (
            <div
              className="position-absolute w-100 d-flex justify-content-center"
              style={{ top: 40 }}
            >
              <ErrorMessage errorMessage={errorMessage}></ErrorMessage>
            </div>
          )}
          <div className="app">{children}</div>
        </div>
      )}
    </>
  )
}
