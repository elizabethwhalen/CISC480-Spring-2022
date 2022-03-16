import { Route, Routes } from 'react-router-dom'
import Login from '../components/Login'
import AddClass from '../components/AddClass'
import AddFaculty from '../components/AddFaculty'

const AppRouter = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Login/>} />
      <Route exact path="/AddClass" element={<AddClass/>} />
      <Route exact path="/AddFaculty" element={<AddFaculty/>} />
    </Routes>
  )
}
export default AppRouter;