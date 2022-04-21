import { Route, Routes } from 'react-router-dom'
import AddClass from '../components/functions/AddClass'
import CalendarTest from '../components/calendar/CalendarTest'
import Home from '../components/layout/Home'
import AddFaculty from '../components/functions/AddFaculty'
import Help from '../components/tools/Help'
import AddRoom from '../components/functions/AddRoom'

const AppRouter = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home/>} />
      <Route exact path="/AddClass" element={<AddClass/>} />
      <Route exact path="/Calendar" element={<CalendarTest/>} />
      <Route exact path="/AddFaculty" element={<AddFaculty/>} />
      <Route exact path="/Help" element={<Help/>}/>
      <Route exact path='/AddRoom' element={<AddRoom/>}/>
    </Routes>
  )
}
export default AppRouter;