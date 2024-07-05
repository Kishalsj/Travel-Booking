const express = require('express');
const router = express.Router();
const Room = require('../Backend/models/room');

router.get('/getallrooms', async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.send(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/getroombyid/:id', async (req, res) => {
  const roomid = req.params.id;

  try {
    const room = await Room.findOne({ _id: roomid });
    if (room) {
      res.send(room);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/addroom', async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).send('New room added successfully');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
