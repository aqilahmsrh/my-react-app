import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';
  
export default function BmiCalculator() {

    const [nric, setSearchNRIC] = useState('');
    const [bmi, setSearchBMI] = useState(null);
    //const [error, setError] = useState(null);
    //const [newnric, setNewNRIC] = useState('nric');

    const handleChange = (event) => {

        setSearchNRIC(event.target.value);

    }

    const api = axios.create({
        baseURL: 'https://24ec-202-186-167-246.ngrok-free.app/', // Replace with your base API URL
        method:"GET",
        headers: {
            'Content-Type': 'application/json',
            
            },
        withCredentials: true, // Include credentials if needed (cookies, etc.)
      });

    const handleSubmit = async () => {

            try {
                const response = await api.options(`/getBmi/${nric}`);
                // Assuming the API returns the age in the response data
                setSearchBMI(response.data.bmi);
            } catch (error) {
                console.error('Error fetching data:', error);
                setSearchBMI(null); // Clear age in case of an error
            }
    };



    return (
      <div className="text-center m-5-auto">
            <h2>Bmi Calculator</h2>
            <h5>Check Your BMI</h5>
            <form>
            <p>
                <label>I/C Number</label><br/>
                <input 
                    type="text" 
                    name={nric}
                    onChange={handleChange} />
            </p>

            <div className="footer">
                <input type= "button" onClick={()=>handleSubmit()} name="btn" value="Calculate"/>
            </div>

            </form>

            {bmi !== null ? (
                <div className="result">
                <p>
                    Your BMI: {bmi}
                </p>
                </div>
            ) : (
                <div className="result">
                <p>No data available for the IC {nric}.</p>
                </div>
            )}
            <footer>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    );
}

//<button onClick={()=>handleSubmit()} type="submit" className="btn">Calculate</button>