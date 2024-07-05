import React, { useEffect, useState } from 'react';
import { Tabs, Table, Tag, Result } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Swal from 'sweetalert2';


const { TabPane } = Tabs;

function Adminscreen() {


    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const checkAdminStatus = async () => {
        try {
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          if (currentUser && currentUser.isAdmin) {
            setIsAdmin(true);
            setLoading(false);
          } else {
            
            window.location.href = '/home';
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          
          setLoading(false);
        }
      };
  
      checkAdminStatus();
    }, []);








  return (
    <div className='container'>
      <div className='ml-3 mt-3 bs mr-3'>
        <h1>Admin Panel</h1>
        <Tabs defaultActiveKey='1'>
          <TabPane tab="Bookings" key="1">
            <Bookings />
          </TabPane>
          <TabPane tab="Rooms" key="2">
            <Rooms />
          </TabPane>
          <TabPane tab="Add Room" key="3">
            <Addroom/>
          </TabPane>
          <TabPane tab="Users" key="4">
            <Users />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Adminscreen;

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings/getallbookings');
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className='row'>
      <div className='col-md-12'>
        <h1>Bookings</h1>
        <Table dataSource={bookings} rowKey='_id'>
          <Table.Column title="Booking Id" dataIndex="_id" key="_id" />
          <Table.Column title="User Id" dataIndex="userid" key="userid" />
          <Table.Column title="Room" dataIndex="room" key="room" />
          <Table.Column title="From" dataIndex="fromdate" key="fromdate" />
          <Table.Column title="To" dataIndex="todate" key="todate" />
          <Table.Column
            title="Status"
            dataIndex="status"
            key="status"
            render={status => (
              status === 'cancelled' ? <Tag color="red">CANCELLED</Tag> : <Tag color="green">CONFIRMED</Tag>
            )}
          />
        </Table>
      </div>
    </div>
  );
}

export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/api/rooms/getallrooms');
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className='row'>
      <div className='col-md-12'>
        <h1>Rooms</h1>
        <Table dataSource={rooms} rowKey='_id'>
          <Table.Column title="Room Id" dataIndex="_id" key="_id" />
          <Table.Column title="Name" dataIndex="name" key="name" />
          <Table.Column title="Type" dataIndex="type" key="type" />
          <Table.Column title="Rent Per Day" dataIndex="rentperday" key="rentperday" />
          <Table.Column title="Max Count" dataIndex="maxcount" key="maxcount" />
          <Table.Column title="Phone Number" dataIndex="phonenumber" key="phonenumber" />
        </Table>
      </div>
    </div>
  );
}

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/getallusers');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  const columns = [
    {
      title: 'User Id',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Is Admin',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: isAdmin => (
        <Tag color={isAdmin ? 'green' : 'blue'}>{isAdmin ? 'Yes' : 'No'}</Tag>
      ),
    },
  ];

  return (
    <div className='row'>
      <div className='col-md-12'>
        <h1>Users</h1>
        <Table dataSource={users} columns={columns} rowKey='_id' />
      </div>
    </div>
  );
}




export function Addroom() {
    const [name, setName] = useState('');
    const [rentperday, setRentPerDay] = useState('');
    const [maxcount, setMaxCount] = useState('');
    const [description, setDescription] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [type, setType] = useState('');
    const [imageurl1, setImageUrl1] = useState('');
    const [imageurl2, setImageUrl2] = useState('');
    const [imageurl3, setImageUrl3] = useState('');
  
    const addRoom = async () => {
      try {
        const newRoom = {
          name,
          rentperday,
          maxcount,
          description,
          phonenumber,
          type,
          imageurl1,
          imageurl2,
          imageurl3
        };
  
        const response = await axios.post('/api/rooms/addroom', newRoom);
        console.log('Room added successfully:', response.data);
  
        
        Swal.fire('congrats' , "Your New Room Added Successfully...!" , 'success').then(result=>{
            window.location.href='/home'
        });
  
        
        setName('');
        setRentPerDay('');
        setMaxCount('');
        setDescription('');
        setPhoneNumber('');
        setType('');
        setImageUrl1('');
        setImageUrl2('');
        setImageUrl3('');
      } catch (error) {
        console.error('Error adding room:', error);
  
        
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to add room. Please try again later.',
        });
      }
    };
  
    return (
      <div className='row'>
        <div className='col-md-5'>
          <input
            type='text'
            className='form-control'
            placeholder='Room Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type='text'
            className='form-control'
            placeholder='Rent Per Day'
            value={rentperday}
            onChange={(e) => setRentPerDay(e.target.value)}
          />
          <input
            type='text'
            className='form-control'
            placeholder='Max Count'
            value={maxcount}
            onChange={(e) => setMaxCount(e.target.value)}
          />
          <input
            type='text'
            className='form-control'
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type='text'
            className='form-control'
            placeholder='Phone Number'
            value={phonenumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className='col-md-5'>
          <input
            type='text'
            className='form-control'
            placeholder='Type'
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <input
            type='text'
            className='form-control'
            placeholder='Image URL 1'
            value={imageurl1}
            onChange={(e) => setImageUrl1(e.target.value)}
          />
          <input
            type='text'
            className='form-control'
            placeholder='Image URL 2'
            value={imageurl2}
            onChange={(e) => setImageUrl2(e.target.value)}
          />
          <input
            type='text'
            className='form-control'
            placeholder='Image URL 3'
            value={imageurl3}
            onChange={(e) => setImageUrl3(e.target.value)}
          />
  
          <div className='text-right'>
            <button className='btn btn-primary m-2' onClick={addRoom}>
              Add Room
            </button>
          </div>
        </div>
      </div>
    );
  }