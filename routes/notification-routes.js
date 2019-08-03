const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Notif = require('../models/notification-model');


router.post("/load",(req,res)=>{
    Notif.find({userId:req.userId}).then((result)=>{
        res.json(result)
    })
})

router.post("/clear",(req,res)=>{
    Notif.deleteMany({userId:req.userId}).then((result)=>{
        res.sendStatus(200)
    })
})


router.post("/loadgeneral",(req,res)=>{
    Notif.find({userId:"global"}).exec((err,result)=>{
        res.json(result)
  })
})

router.post("/delete",(req,res)=>{
    Notif.findByIdAndDelete({userId:req.userId,_id:req.body.id},(err,result)=>{
        if(!err)
        res.sendStatus(200)
    })
})



router.get("/",(req,res)=>{
    var uid=req.query.uid;
    var dpos=req.query.dpos;//dismissPosition

    console.log(dpos)
    if(dpos=="load"){
        Notif.find({userId:uid}).exec((err,result)=>{
            res.json(result)
        })
    }
    else if(dpos=="All"){
        Notif.deleteMany({userId:uid}).exec((err,result)=>{
            if(err)res.send("failed")
            else res.send("success")
        })
    }
    else if(dpos=="general"){
        Notif.find({userId:"global"}).exec((err,result)=>{
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
