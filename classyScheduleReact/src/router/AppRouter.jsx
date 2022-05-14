
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AddClass from '../components/db_forms/AddClass'
import CalendarTest from '../components/calendar/CalendarTest'
import Home from '../components/layout/Home'
import AddFaculty from '../components/db_forms/AddFaculty'
import Help from '../components/tools/Help'
import AddRoom from '../components/db_forms/AddRoom'
import Signup from '../components/logging/Signup'

export default function AppRouter() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/AddClass" element={<AddClass />} />
      <Route exact path="/Calendar" element={<CalendarTest />} />
      <Route exact path="/AddFaculty" element={<AddFaculty />} />
      <Route exact path="/Help" element={<Help />} />
      <Route exact path='/AddRoom' element={<AddRoom />} />
      <Route exact path='/Signup' element={<Signup />} />
    </Routes>
  )
}