import { Loader } from 'UI/Components'
import { Sidebar } from './SidebarComponent'
import { Helmet } from 'react-helmet-async'
import { APP_NAME } from 'Lib'
import { TemplateProps } from 'types'

export function DashboardLayout(props: TemplateProps) {
  const { title, isLoading, children } = props

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
        <div className="app">
          <Sidebar />
          {children}
        </div>
      )}
    </>
  )
}
