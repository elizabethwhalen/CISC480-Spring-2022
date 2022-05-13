import React, { Route, Routes } from 'react-router-dom'
import Login from '../components/logging/Login';
import Signup from '../components/logging/Signup'

export default function LogRouter(props) {
  return (
    <Routes>
      <Route exact path='/' element={<Login const setLoggedIn ={props.setLoggedIn} setToken={props.setToken} />} />
      <Route exact path='/Signup' element={<Signup />} />
    </Routes>
  )
}
