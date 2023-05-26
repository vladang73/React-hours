import React from 'react'
import { Circle } from 'better-react-spinkit'

export function Loader() {
  return (
    <div className="vh-100 position-relative">
      <div className="position-absolute top-50 start-50 translate-middle">
        <Circle size={60} color="#00BFFF" />
      </div>
    </div>
  )
}
