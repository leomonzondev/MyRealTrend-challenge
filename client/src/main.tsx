import React from 'react'
import ReactDOM from 'react-dom/client'

import Home from './Home'

import { SnackbarProvider } from 'notistack'

import './styles/output.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{
      vertical: "bottom",
      horizontal: "right"
    }}>
   <Home />
   </SnackbarProvider>
  </React.StrictMode>
)
