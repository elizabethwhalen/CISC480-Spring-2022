import { Route, Routes } from 'react-router-dom'
// import Login from '../components/Login'
import AddClass from '../components/AddClass'
import Calendar from '../components/Calendar'
import Home from '../components/Home'

const AppRouter = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home/>} />
      <Route exact path="/AddClass" element={<AddClass/>} />
      <Route exact path="/Calendar" element={<Calendar/>} />
    </Routes>
  )
}
export default AppRouter;