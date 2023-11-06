const express = require('express');
const router = express.Router();
const verifyToken = require('./JS/verifyToken.js');


router.get('/:slug', verifyToken, async (req,res)=>{
    res.send(req.params.slug)
});

module.exports = router;