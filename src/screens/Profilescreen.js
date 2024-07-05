import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs } from 'antd';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2'
import { Divider, Flex, Tag } from 'antd';

const { TabPane } = Tabs;

function Profilescreen() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!storedUser) {
            window.location.href = '/login';
        } else {
            setUser(storedUser);
        }
    }, []);

    if (!user) {
        return null; 
    }

    return (
        <div className='ml-3 mt-3 bs'>
            <Tabs defaultActiveKey='1'>
                <TabPane tab="Profile" key="1">
                    
                    <h1>My Profile</h1>
                    <br />
                    
                    <h1>Name: {user.name}</h1>
                    <h1>Email: {user.email}</h1>
                    <h1>Is Admin: {user.isAdmin ? 'YES' : 'NO'}</h1>
                    
                </TabPane>
                <TabPane tab="Bookings" key="2">
                    <MyBookings userId={user._id} />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Profilescreen;

export function MyBookings({ userId }) {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await axios.post('/api/bookings/getbookingsbyuserid', { userid: userId });
                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setLoading(false);
                setError(error);
            }
        };

        fetchBookings();
    }, [userId]);

    const cancelBooking = async (bookingid, roomid) => {
        try {
            setLoading(true);
            const response = await axios.post('/api/bookings/cancelbooking', { bookingid, roomid });
           
           
            setBookings(prevBookings =>
                prevBookings.map(booking =>
                    booking._id === bookingid ? { ...booking, status: 'Cancelled' } : booking
                )
            );
            Swal.fire('Congrats' , 'Your Booking Cancelled Successfully..!' , 'success').then(result => {
                window.location.reload()
            })
            console.log(response);
            setLoading(false);
        } catch (error) {
            console.error('Error cancelling booking:', error);
            
            Swal.fire('Oops' , 'Somthing Went Wring..!', 'error').then(result => {
                window.location.reload()
            })
            setLoading(false);
            setError(error);

        }
    };

    return (
        <div>
            <div className='row'>
                <div className='col-md-6'>
                    {loading && <Loader />}
                    {error && <Error message={error.message} />}
                    {bookings && bookings.map(booking => (
                        <div className='bs' key={booking._id}>
                            <h1>{booking.room}</h1>
                            <p><b>Booking id:</b> {booking._id}</p>
                            <p><b>Check In:</b> {booking.fromdate}</p>
                            <p><b>Check Out:</b> {booking.todate}</p>
                            <p><b>Total Amount:</b> {booking.totalAmount}</p>
                            <p><b>Status:</b> 
                            {booking.status=='cancelled' ?  (<Tag color="red">CANCELLED</Tag>)  : ( <Tag color="green">CONFIRMED</Tag>)}
                            </p>
                            <div className='text-right'> 
                                {booking.status === 'booked' && (
                                    <button 
                                        className='btn btn-primary' 
                                        onClick={() => cancelBooking(booking._id, booking.roomid)}
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
