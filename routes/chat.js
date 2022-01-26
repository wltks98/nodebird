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
    res.redirect('/chat');
} catch (error) {
    console.error(error);
    next(error);
}
});

//방 입장
router.get('/room/:id', async (req, res, next) => {
    try {
      const room = await Room.findOne({ where:{id: req.params.id} });
      //const io = req.app.get('io');

      const chats = await room.getChats({}); //.sort('createdAt')

      return res.render('chat_chat', {
        room,
        chats,
        username:req.user.id
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  });

//채팅입력
router.post('/room/:id/chat', async (req, res, next) => {
  try {
    const chat = await Chat.create({
      message: req.body.chat,
      RoomId:req.params.id,
      UserId:req.user.id
    });
    req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
    res.send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
