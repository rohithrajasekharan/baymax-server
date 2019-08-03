const router = require('express').Router();
const mongoose = require('mongoose');
const Homepage = require('../models/home-model');

//load data for home page
router.post('/load', (req, res) => {
    var targetval = "x"
    if(req.community=="Baby and Me"){
        // calculateWeek()
        targetval = req.community+"_week_"+(req.body.week.toString())
    }
    else if(req.community=="Diabetes"){
        targetval = req.community+"_type_"+(req.body.type.toString())
    }
    else if(req.community=="General"){
        targetval = req.community
    }
    console.log(targetval)
    Homepage.find({target: targetval},{_id:0,target:0}).populate({path:'dailyReads',select:'_id title jist imageId'}).populate({path:'recomProducts'}).populate({path:'videos',select:'_id title content type imageId'}).then(data=>{
        res.json(data);
    })
});

module.exports = router;