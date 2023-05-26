interface errorMessageProps {
  errorMessage: string
}

export function ErrorMessage(props: errorMessageProps) {
  const { errorMessage } = props
  return (
    <div className="alert alert-danger" style={{ zIndex: 99 }}>
      <strong>
        <i className="fas fa-exclamation-triangle" style={{ color: '#842029' }}></i>
        {` ${errorMessage}`}
      </strong>
    </div>
  )
}
