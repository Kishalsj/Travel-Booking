import React from 'react'
import { Link } from 'react-router-dom'

function Landingscreen() {
  return (
    <div className='row landing'>

        <div className='col-md-12 text-center'>

            <h2 style={{color :'white' , fontSize:'170px'}}>Travel Booking</h2>
            <h1 style={{color :'white'}}> Make your Reservation With Us</h1>
            <Link to ='/home'>
            <button className='landingbtn'>Lets Get Started &rarr;</button>
            </Link>

        </div>
      
    </div>
  )
}

export default Landingscreen
