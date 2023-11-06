const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');



router.post('/chat/increase-limit', verifyToken, (req,res)=>{
    const increment = 30;
  
    let messageLimit = req.session.messageLimit || 30;
  
    messageLimit += increment;
  
    req.session.messageLimit = messageLimit;
  
    res.redirect('/auth/chat');
});

module.exports = router;