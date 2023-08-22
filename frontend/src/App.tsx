import { Routes, Route, Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './views/Home'

import './index.css'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  )
}

function Layout() {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  )
}

export default App
