// import React, { useState } from "react"
// import { BrowserRouter as Router } from 'react-router-dom'
// import { Route } from 'react-router-dom'
// import { Routes } from 'react-router-dom'

// // import Home from './components/pages/Home'
// // import Calc from './components/pages/Calc'
// // import Register from './components/pages/Register'

// // import './App.css'

// import TextInput from "./components/TextInput"
// import Button from "./components/Button"

// const App = () => {
//   const [weight, setWeight] = useState();
//   const [height, setHeight] = useState();
//   const [bmi, setBmi] = useState();
//   const [bmiClass, setBmiClass] = useState();

//   const handleHeightChange = (event) => setHeight(event.target.value);
//   const handleWeightChange = (event) => setWeight(event.target.value);

//   const computeBmi = () => {
//     let bmiValue = (weight / (height / 100) ** 2).toFixed(2);
//     setBmi(bmiValue);
//     let bmiClass = getBmi(bmiValue);
//     setBmiClass(bmiClass);
//     setHeight("")
//     setWeight("")
//   };

//   const getBmi = (bmi) => {
    
//     if (bmi < 18.5) {
//       return "Underweight";
//     }
//     if (bmi >= 18.5 && bmi < 24.9) {
//       return "Normal weight";
//     }
//     if (bmi >= 25 && bmi < 29.9) {
//       return "Overweight";
//     }
//     if (bmi >= 30) {
//       return "Obesity";
//     }
//   };

//   return (
//     <div className="App">
//     <div className="container">
//       <div
//         style={{
//           display: "block",
//           width: "50%",
//           margin: "0 auto",
//           padding: "20px",
//           boxSizing: "border-box",
//         }}
//       >
//         <h2>Welcome to our BMI Calculator!</h2> <br></br>
//         <h3>Please enter your IC number</h3>
//       </div>
//       <div className="row">
//         <TextInput
//           label="IC Number"
//           placeholder="Enter IC Number without symbol"
//           handleChange={handleHeightChange}
//           value={number}
//         />
//       </div>
        
//       </div>
//       <div className="row">
//         <Button label="SEARCH" onClick={computeBmi} />
//       </div>
//       <div className="row">
//         {
//           isNaN(bmi)?null:<h3>Your BMI = {bmi}</h3> 
//         }
        
//       </div>
//       <div className="row">
//         <h3>{bmiClass}</h3>
//       </div>
//     </div>
//   );
// };

// export default App;


import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../../App.css'
  
export default function BmiCalculator() {
    const [heightValue, setHeightValue] = useState('');
    const [weightValue, setWeightValue] = useState('');
    const [bmiValue, setBmiValue] = useState('');
    const [bmiMessage, setBmiMessage] = useState('');
  
    const calculateBmi = () => {
        if (heightValue && weightValue) {
            const heightInMeters = heightValue / 100;
            const bmi = (weightValue / (heightInMeters * heightInMeters)).toFixed(2);
            setBmiValue(bmi);
  
            let message = '';
            if (bmi < 18.5) {
                message = 'You are Underweight';
            } else if (bmi >= 18.5 && bmi < 25) {
                message = 'You are Normal weight';
            } else if (bmi >= 25 && bmi < 30) {
                message = 'You are Overweight';
            } else {
                message = 'You are Obese';
            }
            setBmiMessage(message);
        } else {
            setBmiValue('');
            setBmiMessage('');
        }
    };
  
    return (
      <div className="text-center m-5-auto">
            <h2>Bmi Calculator</h2>
            <h5>Check Your BMI</h5>
            <form onSubmit= "/calc">
                <p>
                    <label>I/C Number</label><br/>
                    <input type="text" name="ic" required />
                </p>
                <p>
                <button className="calculate-btn" onClick={calculateBmi}>Click to Calculate BMI</button>
                </p>

              {bmiValue && bmiMessage && (
                <div className="result">
                    <p>
                        Your BMI: <span className="bmi-value">{bmiValue}</span>
                    </p>
                    <p>
                        Result: <span className="bmi-message">{bmiMessage}</span>
                    </p>
                </div>
              )}

            </form>
            <footer>
                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>
    );
}