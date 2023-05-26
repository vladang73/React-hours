export interface TemplateProps {
  title: string
  TitleComponent?: () => JSX.Element
  children: React.ReactNode
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
}
