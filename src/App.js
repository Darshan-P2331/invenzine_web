import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './Routes'
export default function App() {


    return (
        <Router>
            <div className="App">
                <Routes />
            </div>
        </Router>
    )

}