import React from 'react'
import { Link } from 'react-router-dom'

import '../../App.css'

export default function RegisterPage() {

    return (
        <div className="text-center m-5-auto">
            <h2>Register</h2>
            <h5>Fill in your information</h5>
            <form onSubmit= "/register">
                <p>
                    <label>Username</label><br/>
                    <input type="text" name="name" required />
                </p>
                <p>
                    <label>I/C Number</label><br/>
                    <input type="text" name="ic" required />
                </p>
                <p>
                    <label>Age</label><br/>
                    <input type="text" name="age" required />
                </p>
                <p>
                    <label>Weight</label><br/>
                    <input type="text" name="weight" required />
                </p>
                <p>
                    <label>Height</label><br/>
                    <input type="text" name="height" required />
                </p>
                <p>
                    <button id="sub_btn" type="submit">Register</button>
                </p>
            </form>
            <footer>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    )

}