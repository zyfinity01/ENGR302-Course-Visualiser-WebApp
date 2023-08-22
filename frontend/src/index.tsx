import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-tailwind/react'
import { ReactFlowProvider } from 'reactflow'

import App from './App'

import './index.css'
import 'reactflow/dist/style.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <ReactFlowProvider>
          <App />
        </ReactFlowProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)
