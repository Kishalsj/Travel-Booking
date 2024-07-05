import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import Swal from 'sweetalert2';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Bookingscreen() {
  const { roomid } = useParams();
  const query = useQuery();
  const fromdate = query.get('fromdate');
  const todate = query.get('todate');
  const navigate = useNavigate(); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [room, setRoom] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [swalShown, setSwalShown] = useState(false); 

  useEffect(() => {
   
    if (!localStorage.getItem('currentUser')) {
      navigate('/login');
      return;
    }

    const fetchRoom = async () => {
      try {
        const response = await axios.get(`/api/rooms/getroombyid/${roomid}`);
        setRoom(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };

    fetchRoom();
  }, [roomid, navigate]);

  useEffect(() => {
    if (fromdate && todate && room) {
      const startDate = moment(fromdate, 'DD-MM-YYYY');
      const endDate = moment(todate, 'DD-MM-YYYY');
      const days = endDate.diff(startDate, 'days') + 1;
      setTotalDays(days);
      setTotalAmount(days * room.rentperday);
    }
  }, [fromdate, todate, room]);

  async function bookRoom() {
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem('currentUser'))._id,
      fromdate,
      todate,
      totalAmount,
      totalDays,
    };

    try {
      const result = await axios.post('/api/bookings/bookroom', bookingDetails);
      console.log(result.data);
      Swal.fire('Congrats', 'Your Reservation Has been Booked ', 'success').then(result => {
        window.location.reload();
      });

      
      const updatedRoom = await axios.get(`/api/rooms/getroombyid/${roomid}`);
      setRoom(updatedRoom.data); 
    } catch (error) {
      console.error(error);
      Swal.fire('Oops', 'Something Went Wrong..!', 'error').then(result => {
        window.location.reload();
      });
    }
  }

  if (swalShown) {
    return (
      <div className='m-5'>
        <div>
          <div className='row justify-content-center mt-5 bs'>
            <div className='col-md-6'>
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className='bigimg' alt={room.name} />
            </div>
            <div style={{ textAlign: 'right' }} className='col-md-6'>
              <h1>Booking Details</h1>
              <hr />
              <b>
                <p>Name: {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                <p>From date: {fromdate}</p>
                <p>To date: {todate}</p>
                <p>Max Count: {room.maxcount}</p>
              </b>
              <div>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total days: {totalDays}</p>
                  <p>Rent per Day: {room.rentperday}</p>
                  <p>Total Amount: {totalAmount}</p>
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div><Loader /></div>;
  }

  if (error) {
    return <div><Error /></div>;
  }

  return (
    <div className='m-5'>
      <div>
        <div className='row justify-content-center mt-5 bs'>
          <div className='col-md-6'>
            <h1>{room.name}</h1>
            <img src={room.imageurls[0]} className='bigimg' alt={room.name} />
          </div>
          <div style={{ textAlign: 'right' }} className='col-md-6'>
            <h1>Booking Details</h1>
            <hr />
            <b>
              <p>Name: {JSON.parse(localStorage.getItem('currentUser')).name}</p>
              <p>From date: {fromdate}</p>
              <p>To date: {todate}</p>
              <p>Max Count: {room.maxcount}</p>
            </b>
            <div>
              <b>
                <h1>Amount</h1>
                <hr />
                <p>Total days: {totalDays}</p>
                <p>Rent per Day: {room.rentperday}</p>
                <p>Total Amount: {totalAmount}</p>
              </b>
            </div>
            <div style={{ float: 'right' }}>
              <button className='btn btn-primary' onClick={() => { bookRoom(); setSwalShown(true); }}>Pay Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingscreen;
