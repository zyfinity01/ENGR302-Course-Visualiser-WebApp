import NavBar from './components/NavBar'
import { Outlet } from 'react-router-dom'
import { handleExport } from './services/GraphExportService'

const Layout = () => {
  const handleExportClick = () => {
    // Implement your export logic here
    console.log('Export clicked!')
    handleExport()
  }

  return (
    <div>
      <NavBar onExportClick={handleExportClick} />
      <Outlet />
    </div>
  )
}

export default Layout
