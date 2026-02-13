
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

import Budgets from './pages/Budgets'
import Profile from './pages/Profile'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/Login' element={<Login />}></Route>
      <Route path='/Register' element={<Register />}></Route>
      <Route path='/Dashboard' element={<Dashboard />}></Route>
      <Route path='/Budgets' element={<Budgets />}></Route>
      <Route path='/Profiles' element={<Profile />}></Route>
    </Routes>
  )
}

export default App;
