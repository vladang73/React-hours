import React from 'react'
import { Loader } from 'UI/Components'

interface Props {
  title: string
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  children: React.ReactNode
}

export function Template(props: Props) {
  const { isLoading, children } = props

  return <>{isLoading ? <Loader /> : <>{children}</>}</>
}
