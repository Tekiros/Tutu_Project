const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');
const Notification = require('../notificationsSchema.js');


router.get('/notifications', verifyToken, async (req,res)=>{
  try{
    const notifications = await Notification.find()
      .sort({createdAt: -1})
      .limit(10);

      res.json(notifications);
  }catch (error){
    res.status(500).json({error:'Erro ao buscar notificações'});
  }
});

module.exports = router;