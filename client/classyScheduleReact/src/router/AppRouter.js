import { Route, Routes } from 'react-router-dom'
import AddClass from '../components/AddClass'
import Calendar from '../components/Calendar'
import Home from '../components/Home'
import AddFaculty from '../components/AddFaculty'

const AppRouter = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home/>} />
      <Route exact path="/AddClass" element={<AddClass/>} />
      <Route exact path="/Calendar" element={<Calendar/>} />
      <Route exact path="/AddFaculty" element={<AddFaculty/>} />
    </Routes>
  )
}
export default AppRouter;