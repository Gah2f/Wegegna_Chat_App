import React from 'react'
import { Routes, Route  } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className='bg-[url("./src/assets/chat-app-assets/bgImage.svg")] bg-contain'>
      <Toaster/>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/profile' element={<ProfilePage/>}/>
     </Routes>
    </div>
  )
}

export default App