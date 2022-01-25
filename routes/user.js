const express = require('express');
const bcrypt = require('bcrypt');
const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.removeFollowings(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//프로필 사진 가져오기
router.get('/profile_img', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    console.log(user.profile_img)
    res.json({ url: user.profile_img });
    
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//회원정보 수정
router.post('/update', isLoggedIn, async (req, res, next) => {
  try {
    const { email, nick, password } = req.body;

    const hash = await bcrypt.hash(password, 12);
    await User.update({
      email,
      nick,
      password: hash,
    },{
      where:{id:req.user.id}
    })
    res.redirect('/profile')

  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;
