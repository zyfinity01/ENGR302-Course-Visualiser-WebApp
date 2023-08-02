import { Routes, Route, Outlet } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

import Loading from './components/Loading'
import NavBar from './components/NavBar'
import Home from './views/Home'
import Admin from './views/Admin'

const App = () => {
  const { isLoading, error } = useAuth0()

  if (error) {
    return <div>Oops... {error.message}</div>
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="admin" element={<Admin />} />
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
