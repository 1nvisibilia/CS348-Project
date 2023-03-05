import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import axios from 'axios'
import Banner from './Banner'

axios.defaults.baseURL = import.meta.env.BACK_END_URL

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Banner></Banner>
    <App />
  </React.StrictMode>,
)
