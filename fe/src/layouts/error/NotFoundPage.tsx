import { Result } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <Result
      status="404"
      title="404 - Not Found"
      subTitle="Sorry, page not found"
      extra={<Link to="/" type="primary">Back Home</Link>}
    />
  )
}

export default NotFoundPage
