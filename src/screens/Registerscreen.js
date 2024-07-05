import React, { useState } from 'react';
import axios from 'axios';
import Error from "../components/Error";
import Success from '../components/Success';
import Loader from '../components/Loader';

function Registerscreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); 
  const [success, setSuccess] = useState(false);

  async function register() {
    if (password === cpassword) {
      const user = {
        name,
        email,
        password,
        cpassword,
      };

      try {
        setLoading(true);
        const result = (await axios.post('/api/users/register', user)).data;
        setLoading(false);
        setSuccess(true);
        setError(false); 

        setName('');
        setEmail('');
        setPassword('');
        setCPassword('');
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(true);
      }
    } else {
      alert('Passwords do not match');
    }
  }

  return (
    <div>
      {loading && <Loader />}
      {error && <Error />}
      <div className='row justify-content-center mt-5'>
        <div className='col-md-5'>
          {success && <Success message='Registration is Success' />}
          <div className='bs'>
            <h2>Register</h2>
            <input
              type='text'
              className='form-control'
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type='email'
              className='form-control'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='password'
              className='form-control'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type='password'
              className='form-control'
              placeholder='Confirm Password'
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
            />
            <button className='btn btn-primary' onClick={register}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registerscreen;
