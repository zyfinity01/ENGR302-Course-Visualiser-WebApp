import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './views/Home'

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
