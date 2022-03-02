// import 'canvas-ui-css-bloomington'
import { Route, Routes } from 'react-router-dom'
// import { Heading } from 'canvas-ui-react'
import Login from '../components/Login'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  )
}
export default AppRouter;