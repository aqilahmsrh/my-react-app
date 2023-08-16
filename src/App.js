import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'

import Home from './components/pages/Home'
import Calc from './components/pages/Calc'
import Register from './components/pages/Register'

import './App.css'

export default function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route exact path="/" element={<Home />}></Route>
                    <Route path="/calc" element={<Calc />}></Route>
                    <Route path="/register" element={<Register />}></Route>
                </Routes>
            </div>
        </Router>
    )
}

// const Footer = () => {
//     return (
//         <p className="text-center" style={ FooterStyle }>Designed & coded by <a href="https://izemspot.netlify.com" target="_blank" rel="noopener noreferrer">IZEMSPOT</a></p>
//     )
// }

// const FooterStyle = {
//     background: "#222",
//     fontSize: ".8rem",
//     color: "#fff",
//     position: "absolute",
//     bottom: 0,
//     padding: "1rem",
//     margin: 0,
//     width: "100%",
//     opacity: ".5"
// }