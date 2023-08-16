import React, {useState,setState} from 'react';
import './style.css'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function RegisterPage() {
    
    const [username, setUsername] = useState(null);
    const [nric, setNRIC] = useState(null);
    const [age, setAge] = useState(null);
    const [height,setHeight] = useState(null);
    const [weight,setWeight] = useState(null);

    const handleInputChange = (e) => {
        const {id , value} = e.target;
        if(id === "username"){
            setUsername(value);
        }
        if(id === "nric"){
            setNRIC(value);
        }
        if(id === "age"){
            setAge(value);
        }
        if(id === "height"){
            setHeight(value);
        }
        if(id === "weight"){
            setWeight(value);
        }

    }

    const handleSubmit  = () => {
        const userInformation = {
            username: username,
            nric: nric,
            age: age,
            height: height,
            weight: weight,
          };
          
          console.log(userInformation);

          const url = 'https://24ec-202-186-167-246.ngrok-free.app/add_user';

          axios.post(url, userInformation)
            .then((response) => {
            // Handle the response from the Flask server
            console.log(response.data);
            })
            .catch((error) => {
            // Handle errors
            console.error(error);
            });
    };

    return(
        <div className="form">
            <div className="form-body">
                <div className="username">
                    <label className="form__label" for="username"> Username </label>
                    <input className="form__input" type="text" value={username} onChange = {(e) => handleInputChange(e)} id="username" placeholder="username"/>
                </div>
                <div className="nric">
                    <label className="form__label" for="nric">IC Number </label>
                    <input  type="text" name="" id="nric" value={nric}  className="form__input" onChange = {(e) => handleInputChange(e)} placeholder="nric"/>
                </div>
                <div className="age">
                    <label className="form__label" for="age">Age </label>
                    <input  
                    type="text" 
                    id="age" 
                    className="form__input" 
                    value={age} 
                    onChange = {(e) => handleInputChange(e)} 
                    placeholder="age"/>
                </div>
                <div className="height">
                    <label className="form__label" for="height">Height </label>
                    <input className="form__input" type="height"  id="height" value={height} onChange = {(e) => handleInputChange(e)} placeholder="height"/>
                </div>
                <div className="weight">
                    <label className="form__label" for="weight">Weight </label>
                    <input className="form__input" type="weight" id="weight" value={weight} onChange = {(e) => handleInputChange(e)} placeholder="weight"/>
                </div>
            </div>
            <div class="footer">
                <button onClick={()=>handleSubmit()} type="submit" class="btn">Register</button>
            </div>

            <footer>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>

        </div>
       
    )       
}