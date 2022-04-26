import { Route, Routes } from 'react-router-dom'
import Login from '../components/logging/Login';
import Signup from '../components/logging/Signup'

const LogRouter = (props) => {
  return (
    <Routes>
      <Route exact path='/Signup' element={<Signup />}/>
      <Route exact path='/' element={<Login handleLogin = {props.handleLogin}/>}/>
    </Routes>
  )
}
export default LogRouter;