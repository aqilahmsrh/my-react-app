import React from 'react'
import { Link } from 'react-router-dom'

import '../../App.css'
import BackgroundImage from '../../assets/images/bg.jpeg'

export default function LandingPage() {
    return (
        <header style={ HeaderStyle }>
            <h1 className="main-title text-center">BMI CALCULATOR</h1>
            <p className="main-para text-center">register to calculate your bmi</p>
            <div className="buttons text-center">
                <Link to="/register">
                    <button className="primary-button">Register</button>
                </Link>
                <br></br>
                <Link to="/calc">
                    <button className="primary-button" id="reg_btn"><span>Calculate </span></button>
                </Link>
        
            </div>
        </header>
    )
}

const HeaderStyle = {
    width: "100%",
    height: "100vh",
    background: `url(${BackgroundImage})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
}