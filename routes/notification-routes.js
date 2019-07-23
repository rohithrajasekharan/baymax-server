const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Notif = require('../models/notification-model');


router.post("/load",(req,res)=>{
    Notif.find({userid:uid}).exec((err,result)=>{
        res.json(result)
    })
})

router.post("/clear",(req,res)=>{
    Notif.deleteMany({userid:uid}).exec((err,result)=>{
        if(err)res.send("failed")
        else res.send("success")
    })
})


router.post("/loadgeneral",(req,res)=>{
    Notif.find({userid:"global"}).exec((err,result)=>{
        res.json(result)
  })
})

router.post("/delete",(req,res)=>{
    Notif.findByIdAndDelete(dpos,(err,result)=>{
        if(err)res.send("failed")
        else res.send("success")
    })
})



router.get("/",(req,res)=>{
    var uid=req.query.uid;
    var dpos=req.query.dpos;//dismissPosition

    console.log(dpos)
    if(dpos=="load"){
        Notif.find({userid:uid}).exec((err,result)=>{
            res.json(result)
        })
    }
    else if(dpos=="All"){
        Notif.deleteMany({userid:uid}).exec((err,result)=>{
            if(err)res.send("failed")
            else res.send("success")
        })
    }
    else if(dpos=="general"){
        Notif.find({userid:"global"}).exec((err,result)=>{
              res.json(result)
        })
    }
    else {
        Notif.findByIdAndDelete(dpos,(err,result)=>{
            if(err)res.send("failed")
            else res.send("success")
        })
    }
})

module.exports = router;
