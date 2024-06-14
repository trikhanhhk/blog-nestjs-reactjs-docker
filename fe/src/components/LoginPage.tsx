import React from 'react'
import Seo from './common/SEO'
import LoginForm from './LoginForm'

const LoginPage = () => {
  return (
    <div>
      <Seo
        title='Đăng nhập'
        metaDescription='Đăng nhập vào Viblo'
        metaKeywords='Đăng nhập viblo'
      />
      <LoginForm goHome={true} />
    </div>
  )
}

export default LoginPage
