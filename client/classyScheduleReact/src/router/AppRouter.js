import { Route, Routes } from 'react-router-dom'
import Login from '../components/Login'
import AddClass from '../components/AddClass'

const AppRouter = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Login/>} />
      <Route exact path="/AddClass" element={<AddClass/>} />
    </Routes>
  )
}
export default AppRouter;