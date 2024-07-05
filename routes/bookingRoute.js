const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Room = require('../models/room');
const User = require('../models/user'); 


router.post('/bookroom', async (req, res) => {
    const {
        room,
        userid,
        fromdate,
        todate,
        totalAmount,
        totalDays
    } = req.body;

    try {
     
        const user = await User.findById(userid);
        const username = user.name;

        const newBooking = new Booking({
            room: room.name,
            roomid: room._id,
            userid,
            username, 
            fromdate,
            todate,
            totalAmount,
            totalDays,
            status: 'booked',
            transactionId: '1234'
        });

        await newBooking.save();

        
        const roomTemp = await Room.findOne({ _id: room._id });

        if (!roomTemp.currentbookings) {
            roomTemp.currentbookings = [];
        }

        roomTemp.currentbookings.push({
            bookingid: newBooking._id,
            fromdate: fromdate,
            todate: todate,
            userid: userid,
            username: username, 
            status: 'booked'
        });

        await roomTemp.save();

        res.send('Room Booked Successfully');
    } catch (error) {
        console.error('Error in booking room:', error);
        return res.status(400).json({ error: error.message });
    }
});


router.post('/getbookingsbyuserid', async (req, res) => {
    const { userid } = req.body;

    try {
        const bookings = await Booking.find({ userid: userid });
        res.send(bookings);
    } catch (error) {
        console.error('Error in fetching bookings by user ID:', error);
        return res.status(400).json({ error: error.message });
    }
});


router.post('/cancelbooking', async (req, res) => {
    const { bookingid, roomid } = req.body;

    try {
        const bookingitem = await Booking.findOne({ _id: bookingid });

        if (!bookingitem) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        bookingitem.status = 'cancelled'; 
        await bookingitem.save();

        const room = await Room.findOne({ _id: roomid });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        
        room.currentbookings = room.currentbookings.filter(booking => booking.bookingid.toString() !== bookingid);
        await room.save();

        res.send('Your booking has been cancelled successfully.');
    } catch (error) {
        console.error('Error in cancelling booking:', error);
        return res.status(400).json({ error: error.message });
    }
});


router.get('/getallbookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error in fetching all bookings:', error);
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;
