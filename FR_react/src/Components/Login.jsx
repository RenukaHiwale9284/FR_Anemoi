import { useState } from 'react'
import './Login.css'
import {useNavigate} from 'react-router-dom'
const Login = () => {

  const [values, setValues]= useState({
    email:'',
    password:''
  });

  const navigate = useNavigate()
const handleSubmit =(event)=>{
  event.preventDefault()
  console.log(event,"hello clicj",values);

  if(values.email==='admin@gmail.com'&& values.password==='Anemoi@123'){
    console.log("login Successful");
   navigate('/dashboard')
  }
  else{
    console.log("Login failed");
  }
}
// const RegisterUser =(event)=>{
//   navigate('/register')
// }
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm" >
        <div className='text-warning'> </div>
        <h2 className="header">Login Page</h2>
        <br></br>
        <br></br>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
          <label htmlFor="email"><strong>Email:</strong></label>
            <input type="email" name="email" autoComplete="off" placeholder="Enter Email" className="form-control rounded-0" onChange={(e)=> setValues({...values, email: e.target.value})}></input>
          </div>
          <div className='mb-3'>
            <label htmlFor="password"><strong>Password:</strong></label>
            <input type="password" name="password" placeholder="Enter Password" className="form-control rounded-0" onChange={(e)=> setValues({...values, password: e.target.value})}></input>
          </div>
           <button className="btn btn-success w-100 rounded-0 mb-2">Log In</button>

           <div className='mb-1'>
            <input type='checkbox' name='tick' id='tick' className='me-2'></input>
            <label htmlFor="password">You are Agree With terms & conditions</label>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login