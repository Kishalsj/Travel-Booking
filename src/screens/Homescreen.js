import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [duplicaterooms, setDuplicaterooms] = useState([]);
  const [searchkey, setSearchKey] = useState('');
  const [type, setType] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/rooms/getallrooms');
        setDuplicaterooms(response.data);
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function filterByDate(dates, dateStrings) {
    if (dates && dates.length === 2) {
      setSelectedDates(dateStrings);

      const fromdate = moment(dateStrings[0], 'DD-MM-YYYY');
      const todate = moment(dateStrings[1], 'DD-MM-YYYY');

      let temprooms = [];

      for (const room of duplicaterooms) {
        let availability = true;

        if (room.currentbookings.length > 0) {
          for (const booking of room.currentbookings) {
            const bookingFromDate = moment(booking.fromdate, 'DD-MM-YYYY');
            const bookingToDate = moment(booking.todate, 'DD-MM-YYYY');

            if (
              fromdate.isBetween(bookingFromDate, bookingToDate, undefined, '[]') ||
              todate.isBetween(bookingFromDate, bookingToDate, undefined, '[]') ||
              bookingFromDate.isBetween(fromdate, todate, undefined, '[]') ||
              bookingToDate.isBetween(fromdate, todate, undefined, '[]')
            ) {
              availability = false;
              break;
            }
          }
        }

        if (availability) {
          temprooms.push(room);
        }
      }

      filterRooms(temprooms);
    }
  }

  function filterRooms(roomsToFilter) {
    let filteredRooms = roomsToFilter;

    if (searchkey) {
      filteredRooms = filteredRooms.filter(room =>
        room.name.toLowerCase().includes(searchkey.toLowerCase())
      );
    }

    if (type !== 'all') {
      filteredRooms = filteredRooms.filter(room =>
        room.type.toLowerCase() === type.toLowerCase()
      );
    }

    setRooms(filteredRooms);
  }

  useEffect(() => {
    filterRooms(duplicaterooms);
  }, [searchkey, type]);

  return (
    <div className='container'>
      <div className='row mt-5 bs'>
        <div className='col-md-3'>
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
        </div>

        <div className='col-md-5'>
          <input
            type='text'
            className='form-control'
            placeholder='Search Rooms'
            value={searchkey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <div className='col-md-3'>
          <select className='form-control' value={type} onChange={(e) => setType(e.target.value)}>
            <option value='all'>All</option>
            <option value='family'>Family</option>
            <option value='couple'>Couple</option>
            <option value='single'>Single</option>
          </select>
        </div>
      </div>

      <div className='row justify-content-center mt-5'>
        {loading ? (
          <Loader />
        ) : rooms.length > 0 ? (
          rooms.map((room) => (
            <div className='col-md-9 mt-2' key={room._id}>
              <Room room={room} fromdate={selectedDates[0]} todate={selectedDates[1]} />
            </div>
          ))
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
}

export default Homescreen;
