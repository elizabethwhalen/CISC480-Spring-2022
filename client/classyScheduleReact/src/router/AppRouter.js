import { Route, Routes } from 'react-router-dom'
import Login from '../components/Login'
import AddClass from '../components/AddClass'
import Calendar from '../components/Calendar'

const AppRouter = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Login/>} />
      <Route exact path="/AddClass" element={<AddClass/>} />
      <Route exact path="/Calendar" element={<Calendar/>} />
    </Routes>
  )
}
export default AppRouter;