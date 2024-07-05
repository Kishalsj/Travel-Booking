import React, { useState } from 'react'
import axios from 'axios';
import Error from "../components/Error"
import Loader from '../components/Loader';


function Loginscreen() {


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
 
  const [email ,setemail] = useState('')
  const [password ,setpassword] = useState('')



  async function Login(){

   

    const user={
     
      email,
      password,
     
    }
    try {
        setLoading(true);
        const result = (await axios.post('/api/users/login', user)).data;
        setLoading(false);
        localStorage.setItem('currentUser' , JSON.stringify(result));
        window.location.href='/home'
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true)
      }


   
  


  }
  return (
    <div>
        {loading && (<Loader/>)}
<div className='row justify-content-center mt-5'>
<div className='col-md-5'>
    {error && (<Error message = 'Invalid Credentionals'/>)}
<div className='bs'>
  <h2>Login</h2>
 
  <input type='email' className='form-control' placeholder='Email'value={email} onChange={(e)=> {setemail(e.target.value)}}></input>
  <input type='password' className='form-control' placeholder='Password'value={password} onChange={(e)=> {setpassword(e.target.value)}}></input>
 

  <button className='btn btn-primary'onClick={Login}>Login</button>
</div>

</div>
    </div>
    </div>
  )
}

export default Loginscreen
