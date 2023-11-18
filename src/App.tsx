import { Outlet } from 'react-router-dom'
import AWS from 'aws-sdk'

const region = 'sa-east-1'

AWS.config.update({
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  region,
})

export function App() {
  return (
    <>
      <Outlet />
    </>
  )
}
