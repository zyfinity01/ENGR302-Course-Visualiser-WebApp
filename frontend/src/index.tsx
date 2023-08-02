import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider, CacheLocation } from '@auth0/auth0-react'

import App from './App'
import 'bootstrap/dist/css/bootstrap.css'

const providerConfig = {
  domain: process.env.REACT_APP_AUTH_DOMAIN as string,
  clientId: process.env.REACT_APP_AUTH_CLIENT_ID as string,
  cacheLocation: 'localstorage' as CacheLocation,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: process.env.REACT_APP_AUTH_AUDIENCE,
  },
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Auth0Provider {...providerConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>
)
