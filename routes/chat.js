const express = require('express');
const path = require('path');

const { User,Room,Chat } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {

    //const rooms=await Room.findAll({});

    const user=await User.findOne({where:{id:req.user.id}})

    const rooms = await user.getRooms({
    });
    console.log(rooms)
    res.render('chat_main', { rooms, title: '채팅방' });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//방 생성 페이지로 이종
router.get('/room', (req, res) => { 
    res.render('chat_room', { title: '채팅방 생성' });
  });
  
//방 생성
router.post('/room', async (req, res, next) => {
try {
    const newRoom = await Room.create({
    });

    const user1=await User.findOne({where:{id:req.user.id}})
    const user2=await User.findOne({where:{nick:req.body.follwer_nick}})

    await newRoom.addUsers([user1,user2]);

    const io = req.app.get('io');
    io.of('/room').emit('newRoom', newRoom);
    res.redirect('/');
    // const io = req.app.get('io');
    // io.of('/room').emit('newRoom', newRoom);
    // res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
} catch (error) {
    console.error(error);
    next(error);
}
});

//방 입장
router.get('/room/:id', async (req, res, next) => {
    try {
      const room = await Room.findOne({ _id: req.params.id });
      const io = req.app.get('io');
      if (!room) {
        return res.redirect('/?error=존재하지 않는 방입니다.');
      }
      if (room.password && room.password !== req.query.password) {
        return res.redirect('/?error=비밀번호가 틀렸습니다.');
      }
      const { rooms } = io.of('/chat').adapter;
      if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
        return res.redirect('/?error=허용 인원이 초과하였습니다.');
      }
      const chats = await Chat.find({ room: room._id }).sort('createdAt');
      return res.render('chat', {
        room,
        title: room.title,
        chats,
        user: req.session.color,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });


module.exports = router;
