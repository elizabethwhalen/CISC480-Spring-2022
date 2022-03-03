import { Route, Routes } from 'react-router-dom'
import Login from '../components/Login'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  )
}
export default AppRouter;